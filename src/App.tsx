import { useState, useEffect } from 'react'
import { Trash2, Plus, CheckCircle, Circle, Tag } from 'lucide-react'

type Todo = { id: number; text: string; category: string; isDone: boolean; isDeleting?: boolean };

function App() {
  // استفاده از کلید ثابت برای جلوگیری از پاک شدن اطلاعات
  const [list, setList] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('my-todo-list-v1');
    return saved ? JSON.parse(saved) : [];
  });

  const [categories, setCategories] = useState(['خانه', 'خودم', 'خرید', 'عمومی', 'قسط']);
  const [task, setTask] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('عمومی');
  const [newCat, setNewCat] = useState('');
  const [filter, setFilter] = useState('همه');

  // ذخیره‌سازی خودکار در هر بار تغییر لیست
  useEffect(() => {
    localStorage.setItem('my-todo-list-v1', JSON.stringify(list));
  }, [list]);

  const addTask = () => {
    if (task.trim()) {
      setList([...list, { id: Date.now(), text: task.trim(), category: selectedCategory, isDone: false }]);
      setTask('');
      setFilter(selectedCategory); // انتقال خودکار به دسته جدید
    }
  };

  const deleteTask = (id: number) => {
    setList(list.map(t => t.id === id ? { ...t, isDeleting: true } : t));
    setTimeout(() => {
      setList(list.filter(t => t.id !== id));
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans text-slate-900" dir="rtl">
      <div className="max-w-2xl mx-auto bg-white rounded-[32px] p-8 shadow-xl border border-slate-100">
        <h1 className="text-3xl font-extrabold mb-8 text-center">برنامه‌ریزی روزانه</h1>

        {/* بخش مدیریت دسته‌ها */}
        <div className="bg-slate-50 p-4 rounded-2xl mb-6 border border-slate-100">
          <h2 className="text-xs font-bold text-slate-400 mb-3 px-1">مدیریت دسته‌ها</h2>
          <div className="flex gap-2">
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="p-3 rounded-2xl bg-white border border-slate-200 font-bold flex-1">
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input value={newCat} onChange={(e) => setNewCat(e.target.value)} placeholder="دسته جدید" className="p-3 rounded-2xl bg-white border border-slate-200 w-24 text-slate-700" />
            <button onClick={() => { if (newCat) { setCategories([...categories, newCat]); setNewCat('') } }} className="bg-slate-800 text-white px-4 rounded-2xl font-bold transition hover:bg-slate-900">+</button>
          </div>
        </div>
        {/* بخش افزودن کار */}
        <div className="flex gap-2 mb-8 w-full max-w-full overflow-hidden">
          <input
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
            placeholder="چه کاری باید انجام شود؟"
            className="flex-1 min-w-0 p-4 rounded-2xl bg-slate-100 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addTask}
            className="bg-blue-600 text-white px-4 py-4 rounded-2xl font-bold flex-shrink-0 hover:bg-blue-700 transition"
          >
            افزودن
          </button>
        </div>

        {/* لیست کارها */}
        <ul className="space-y-3">
          {list.filter(t => filter === 'همه' || t.category === filter).map((todo) => (
            <li key={todo.id} className={`flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm transition-all duration-500 ${todo.isDeleting ? 'opacity-0 scale-95' : 'opacity-100'}`}>
              <div className="flex items-center gap-3">
                <button onClick={() => setList(list.map(t => t.id === todo.id ? { ...t, isDone: !t.isDone } : t))}>
                  {todo.isDone ? <CheckCircle className="text-green-600" /> : <Circle className="text-slate-300" />}
                </button>
                <div>
                  <p className={`font-semibold ${todo.isDone ? 'line-through text-slate-400' : 'text-slate-900'}`}>{todo.text}</p>
                  <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full inline-block mt-1"><Tag size={8} className="inline ml-1" />{todo.category}</span>
                </div>
              </div>
              <button onClick={() => deleteTask(todo.id)} className="text-slate-300 hover:text-red-500 transition"><Trash2 size={18} /></button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
export default App