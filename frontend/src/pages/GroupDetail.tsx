import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

type GroupDTO = {
  id: number;
  name: string;
  description?: string | null;
  createdById: number;
  createdByName: string;
  memberIds: number[];
};

type UserDTO = {
  id: number;
  name: string;
  email: string;
};

type ExpenseSplitDTO = {
  id: number;
  userId: number;
  userName: string;
  amount: number;
  paid: boolean;
};

type ExpenseDTO = {
  id: number;
  description: string;
  amount: number;
  groupId: number;
  paidById: number;
  paidByName: string;
  createdAt: string;
  splits: ExpenseSplitDTO[];
};

type SettlementDTO = {
  fromUserId: number;
  fromUserName: string;
  toUserId: number;
  toUserName: string;
  amount: number;
};

const round2 = (n: number) => Math.round(n * 100) / 100;

export default function GroupDetail() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const gid = Number(groupId);
  const [loading, setLoading] = useState(true);
  const [group, setGroup] = useState<GroupDTO | null>(null);
  const [members, setMembers] = useState<UserDTO[]>([]);
  const [expenses, setExpenses] = useState<ExpenseDTO[]>([]);
  const [settlements, setSettlements] = useState<SettlementDTO[]>([]);
  const [error, setError] = useState<string>('');

  // Create expense form
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [splits, setSplits] = useState<Record<number, number>>({});

  const memberIds = useMemo(() => (group?.memberIds ?? []), [group]);

  useEffect(() => {
    if (!gid || Number.isNaN(gid)) {
      navigate('/dashboard');
      return;
    }

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const groupRes = await api.get(`/groups/${gid}`);
        const g: GroupDTO = groupRes.data;
        setGroup(g);

        // Fetch member details (backend GroupDTO only includes ids)
        const users = await Promise.all(
          (g.memberIds ?? []).map(async (id) => {
            const r = await api.get(`/users/${id}`);
            return r.data as UserDTO;
          }),
        );
        users.sort((a, b) => a.name.localeCompare(b.name));
        setMembers(users);

        const expRes = await api.get(`/groups/${gid}/expenses`);
        setExpenses(expRes.data);

        const setRes = await api.get(`/groups/${gid}/settlements`);
        setSettlements(setRes.data);

        // init default splits (equal)
        const initial: Record<number, number> = {};
        for (const u of users) initial[u.id] = 0;
        setSplits(initial);
      } catch (e: any) {
        console.error('Error loading group detail:', e);
        if (e?.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setError('Failed to load group. Is the backend running?');
        }
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [gid, navigate]);

  const fillEqualSplits = () => {
    if (!members.length) return;
    const total = round2(amount || 0);
    const n = members.length;
    const base = round2(total / n);
    const result: Record<number, number> = {};
    for (const m of members) result[m.id] = base;

    // Fix rounding remainder by adjusting the first member
    const sum = round2(Object.values(result).reduce((a, b) => a + b, 0));
    const remainder = round2(total - sum);
    if (remainder !== 0) {
      result[members[0].id] = round2(result[members[0].id] + remainder);
    }
    setSplits(result);
  };

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const totalSplits = round2(Object.values(splits).reduce((a, b) => a + (Number(b) || 0), 0));
      const totalAmount = round2(amount || 0);
      if (totalAmount <= 0) {
        setError('Amount must be > 0');
        return;
      }
      if (totalSplits !== totalAmount) {
        setError(`Splits must sum to ${totalAmount}. Current sum: ${totalSplits}`);
        return;
      }

      await api.post(`/groups/${gid}/expenses`, {
        description: desc,
        amount: totalAmount,
        groupId: gid,
        splits,
      });

      setDesc('');
      setAmount(0);
      fillEqualSplits();

      const expRes = await api.get(`/groups/${gid}/expenses`);
      setExpenses(expRes.data);

      const setRes = await api.get(`/groups/${gid}/settlements`);
      setSettlements(setRes.data);
    } catch (err: any) {
      console.error('Error creating expense:', err);
      setError(err?.response?.data?.message || 'Failed to create expense');
    }
  };

  if (loading) return <div className="p-8">Loading group...</div>;
  if (!group) return <div className="p-8">Group not found.</div>;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
          <div>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-sm text-blue-600 hover:underline dark:text-blue-300"
            >
              ← Back
            </button>
            <h1 className="mt-2 text-2xl font-bold">{group.name}</h1>
            <p className="text-gray-600 dark:text-gray-400">Created by {group.createdByName}</p>
          </div>
        </div>

        {error && (
          <div className="rounded bg-red-100 p-3 text-sm text-red-700 dark:bg-red-900 dark:text-red-100">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-bold">Members</h2>
            <ul className="space-y-2">
              {members.map((m) => (
                <li key={m.id} className="flex justify-between rounded bg-gray-100 p-3 dark:bg-gray-700">
                  <span className="font-medium">{m.name}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-300">{m.email}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-bold">Create Expense</h2>
            <form onSubmit={handleCreateExpense} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <input
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  required
                  className="mt-1 w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:outline-none
                    dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Total Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  required
                  className="mt-1 w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:outline-none
                    dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Splits</h3>
                <button
                  type="button"
                  onClick={fillEqualSplits}
                  className="rounded bg-blue-100 px-3 py-1 text-sm text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100 dark:hover:bg-blue-800"
                >
                  Equal Split
                </button>
              </div>

              <div className="space-y-2">
                {members.map((m) => (
                  <div key={m.id} className="flex items-center justify-between gap-3">
                    <span className="text-sm">{m.name}</span>
                    <input
                      type="number"
                      step="0.01"
                      value={splits[m.id] ?? 0}
                      onChange={(e) =>
                        setSplits((prev) => ({
                          ...prev,
                          [m.id]: Number(e.target.value),
                        }))
                      }
                      className="w-32 rounded-md border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:outline-none
                        dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                ))}
              </div>

              <button className="w-full rounded-md bg-green-600 py-2 text-white hover:bg-green-700 transition">
                Add Expense
              </button>
            </form>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-bold">Expenses</h2>
            {expenses.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No expenses yet.</p>
            ) : (
              <ul className="space-y-3">
                {expenses.map((e) => (
                  <li key={e.id} className="rounded bg-gray-100 p-4 dark:bg-gray-700">
                    <div className="flex justify-between">
                      <div>
                        <div className="font-semibold">{e.description}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Paid by {e.paidByName}</div>
                      </div>
                      <div className="font-mono">${round2(Number(e.amount)).toFixed(2)}</div>
                    </div>
                    <div className="mt-3 text-sm text-gray-700 dark:text-gray-200">
                      <div className="font-semibold mb-1">Splits</div>
                      <ul className="space-y-1">
                        {e.splits?.map((s) => (
                          <li key={s.id} className="flex justify-between">
                            <span>
                              {s.userName} {s.paid ? '(paid)' : ''}
                            </span>
                            <span className="font-mono">${round2(Number(s.amount)).toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-bold">Who owes whom</h2>
            {settlements.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">All settled up (or no unpaid splits).</p>
            ) : (
              <ul className="space-y-2">
                {settlements.map((s, idx) => (
                  <li key={`${s.fromUserId}-${s.toUserId}-${idx}`} className="rounded bg-gray-100 p-3 dark:bg-gray-700">
                    <div className="flex justify-between">
                      <span>
                        <span className="font-semibold">{s.fromUserName}</span> owes{' '}
                        <span className="font-semibold">{s.toUserName}</span>
                      </span>
                      <span className="font-mono">${round2(Number(s.amount)).toFixed(2)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
    </div>
  );
}


