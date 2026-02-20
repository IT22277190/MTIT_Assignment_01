import React, { useState, useEffect } from 'react';

const TaskBoard = () => {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState({ id: null, title: '', description: '', is_completed: false });
    const [isEditing, setIsEditing] = useState(false);

    // Fetch tasks
    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await fetch('http://localhost:8000/tasks');
            if (!response.ok) throw new Error('Failed to fetch tasks');
            const data = await response.json();
            setTasks(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (taskId) => {
        if (!window.confirm("Delete this task?")) return;
        try {
            const response = await fetch(`http://localhost:8000/tasks/${taskId}`, { method: 'DELETE' });
            if (response.ok) setTasks(tasks.filter(task => task.id !== taskId));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const handleToggleComplete = async (task) => {
        const updatedTask = { ...task, is_completed: !task.is_completed };
        try {
            const response = await fetch(`http://localhost:8000/tasks/${task.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedTask)
            });
            if (response.ok) {
                setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let url = 'http://localhost:8000/tasks';
            let method = 'POST';
            let body = currentTask;

            if (isEditing) {
                url = `http://localhost:8000/tasks/${currentTask.id}`;
                method = 'PUT';
            } else {
                const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
                body = { ...currentTask, id: newId };
            }

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                const savedTask = await response.json();
                isEditing 
                    ? setTasks(tasks.map(t => t.id === savedTask.id ? savedTask : t))
                    : setTasks([...tasks, savedTask]);
                closeModal();
            }
        } catch (error) {
            console.error('Error saving task:', error);
        }
    };

    const openAddModal = () => { setIsEditing(false); setCurrentTask({ id: null, title: '', description: '', is_completed: false }); setIsModalOpen(true); };
    const openEditModal = (task) => { setIsEditing(true); setCurrentTask(task); setIsModalOpen(true); };
    const closeModal = () => setIsModalOpen(false);

    // --- Inline Styles for Compatibility (Since Tailwind might be misbehaving) ---
    const styles = {
        page: { backgroundColor: '#0f172a', minHeight: '100vh', color: '#f8fafc', fontFamily: 'sans-serif', padding: '40px 20px' },
        container: { maxWidth: '1200px', margin: '0 auto' },
        header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid #334155', paddingBottom: '20px' },
        title: { fontSize: '2.5rem', fontWeight: 'bold', background: 'linear-gradient(to right, #818cf8, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 },
        subtitle: { color: '#94a3b8', marginTop: '5px' },
        addButton: { backgroundColor: '#4f46e5', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' },
        
        grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' },
        
        card: (isCompleted) => ({
            backgroundColor: '#1e293b', 
            borderRadius: '16px', 
            padding: '24px', 
            border: '1px solid #334155', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '16px',
            opacity: isCompleted ? 0.7 : 1,
            transition: 'all 0.2s ease',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        }),
        
        cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'start' },
        cardTitle: (isCompleted) => ({ fontSize: '1.25rem', fontWeight: '600', color: isCompleted ? '#94a3b8' : 'white', textDecoration: isCompleted ? 'line-through' : 'none', margin: 0 }),
        statusDot: (isCompleted) => ({ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: isCompleted ? '#22c55e' : '#f97316', flexShrink: 0, marginTop: '8px' }),
        
        description: { color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.5', margin: 0, flexGrow: 1 },
        
        cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #334155', marginTop: 'auto' },
        
        checkboxWrapper: { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', userSelect: 'none' },
        checkbox: { width: '18px', height: '18px', accentColor: '#6366f1', cursor: 'pointer' },
        statusText: { fontSize: '0.875rem', fontWeight: '500', color: '#94a3b8' },
        
        actionButtons: { display: 'flex', gap: '8px' },
        iconBtn: { background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '6px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
        
        // Modal
        overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 },
        modal: { backgroundColor: '#1e293b', padding: '30px', borderRadius: '16px', width: '100%', maxWidth: '500px', border: '1px solid #475569', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' },
        modalHeader: { fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px', color: 'white' },
        formGroup: { marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px' },
        label: { fontSize: '0.9rem', fontWeight: '500', color: '#e2e8f0' },
        input: { backgroundColor: '#0f172a', border: '1px solid #475569', padding: '12px', borderRadius: '8px', color: 'white', fontSize: '1rem', outline: 'none' },
        modalActions: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '30px' },
        cancelBtn: { backgroundColor: 'transparent', color: '#cbd5e1', border: '1px solid #475569', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' },
        saveBtn: { backgroundColor: '#4f46e5', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }
    };

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <header style={styles.header}>
                    <div>
                        <h1 style={styles.title}>Task Board</h1>
                        <p style={styles.subtitle}>Stay organized and get things done.</p>
                    </div>
                    <button onClick={openAddModal} style={styles.addButton}>
                        <span>+</span> New Task
                    </button>
                </header>

                <div style={styles.grid}>
                    {tasks.map(task => (
                        <div key={task.id} style={styles.card(task.is_completed)}>
                            <div style={styles.cardHeader}>
                                <h3 style={styles.cardTitle(task.is_completed)}>{task.title}</h3>
                                <div style={styles.statusDot(task.is_completed)} title={task.is_completed ? "Completed" : "Pending"}></div>
                            </div>
                            
                            <p style={styles.description}>{task.description || "No description provided."}</p>
                            
                            <div style={styles.cardFooter}>
                                <label style={styles.checkboxWrapper}>
                                    <input 
                                        type="checkbox" 
                                        checked={task.is_completed} 
                                        onChange={() => handleToggleComplete(task)}
                                        style={styles.checkbox}
                                    />
                                    <span style={styles.statusText}>{task.is_completed ? 'Completed' : 'Pending'}</span>
                                </label>
                                
                                <div style={styles.actionButtons}>
                                    <button onClick={() => openEditModal(task)} style={styles.iconBtn} title="Edit">
                                        ✏️
                                    </button>
                                    <button onClick={() => handleDelete(task.id)} style={{...styles.iconBtn, color: '#ef4444'}} title="Delete">
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {tasks.length === 0 && (
                        <div style={{gridColumn: '1 / -1', textAlign: 'center', padding: '60px', border: '2px dashed #334155', borderRadius: '12px', color: '#64748b'}}>
                            <h3>No tasks yet</h3>
                            <p>Click "New Task" to create your first item.</p>
                        </div>
                    )}
                </div>

                {/* Modal */}
                {isModalOpen && (
                    <div style={styles.overlay}>
                        <div style={styles.modal}>
                            <h2 style={styles.modalHeader}>{isEditing ? 'Edit Task' : 'Create New Task'}</h2>
                            <form onSubmit={handleSubmit}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Title</label>
                                    <input 
                                        style={styles.input}
                                        value={currentTask.title}
                                        onChange={(e) => setCurrentTask({...currentTask, title: e.target.value})}
                                        required 
                                        placeholder="What needs to be done?"
                                    />
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Description</label>
                                    <textarea 
                                        style={{...styles.input, minHeight: '100px', resize: 'vertical'}}
                                        value={currentTask.description}
                                        onChange={(e) => setCurrentTask({...currentTask, description: e.target.value})}
                                        placeholder="Add more details..."
                                    />
                                </div>
                                <div style={styles.modalActions}>
                                    <button type="button" onClick={closeModal} style={styles.cancelBtn}>Cancel</button>
                                    <button type="submit" style={styles.saveBtn}>Save Task</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskBoard;
