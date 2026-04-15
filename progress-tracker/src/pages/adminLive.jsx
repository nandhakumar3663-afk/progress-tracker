import "./admin.css";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    DEFAULT_PROGRESS,
    SKILLS,
    STUDENTS,
    getDefaultLeaderboard,
} from "../data/students";
import {
    getLeaderboard,
    getUserProgress,
    isLiveStorageConfigured,
    saveUserProgress,
} from "../lib/progressStorage";

const FIREBASE_SETUP_MESSAGE =
    "Firebase live storage is not configured. Add VITE_FIREBASE_PROJECT_ID and VITE_FIREBASE_API_KEY in Vercel.";
const PROJECTS_STORAGE_KEY = "progress_tracker_admin_projects";

function readProjects() {
    try {
        return JSON.parse(localStorage.getItem(PROJECTS_STORAGE_KEY)) || [];
    } catch {
        return [];
    }
}

function writeProjects(projects) {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
}

function progressWithLeaderboardFallback(row) {
    return {
        ...DEFAULT_PROGRESS,
        rp: row.rewardpoints || 0,
        ap: row.activitypoints || 0,
    };
}

function countSkills(progress) {
    return SKILLS.filter((skill) => Number(progress[skill.key]) >= 1).length;
}

function getNumber(value) {
    const number = Number(value);
    return Number.isFinite(number) ? Math.max(0, Math.trunc(number)) : 0;
}

export default function AdminLive() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("members");
    const [rows, setRows] = useState(getDefaultLeaderboard);
    const [progressById, setProgressById] = useState({});
    const [status, setStatus] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [editId, setEditId] = useState(STUDENTS[0]?.id || "");
    const [editProgress, setEditProgress] = useState(DEFAULT_PROGRESS);
    const [projects, setProjects] = useState(readProjects);
    const [projectForm, setProjectForm] = useState({
        name: "",
        deadline: "",
        description: "",
        tasks: "",
        members: [],
    });
    const [roles, setRoles] = useState({});

    useEffect(() => {
        if (localStorage.getItem("loggedInAs") !== "admin") {
            navigate("/", { replace: true });
        }
    }, [navigate]);

    const selectedEditRow = useMemo(
        () => rows.find((row) => row.id === editId) || rows[0],
        [editId, rows]
    );

    const totals = useMemo(() => {
        return rows.reduce(
            (summary, row) => ({
                members: summary.members + 1,
                rewardpoints: summary.rewardpoints + (row.rewardpoints || 0),
                activitypoints: summary.activitypoints + (row.activitypoints || 0),
            }),
            { members: 0, rewardpoints: 0, activitypoints: 0 }
        );
    }, [rows]);

    useEffect(() => {
        let isMounted = true;

        async function loadMembers() {
            setIsLoading(true);

            if (!isLiveStorageConfigured) {
                const defaultRows = getDefaultLeaderboard();
                const fallbackProgress = Object.fromEntries(
                    defaultRows.map((row) => [row.id, progressWithLeaderboardFallback(row)])
                );

                if (isMounted) {
                    setRows(defaultRows);
                    setProgressById(fallbackProgress);
                    setStatus(FIREBASE_SETUP_MESSAGE);
                    setIsLoading(false);
                }
                return;
            }

            try {
                const leaderboard = await getLeaderboard(getDefaultLeaderboard());
                const progressEntries = await Promise.all(
                    leaderboard.map(async (row) => {
                        try {
                            return [row.id, await getUserProgress(row.id)];
                        } catch {
                            return [row.id, progressWithLeaderboardFallback(row)];
                        }
                    })
                );

                if (isMounted) {
                    setRows(leaderboard);
                    setProgressById(Object.fromEntries(progressEntries));
                    setStatus("");
                }
            } catch (error) {
                if (isMounted) {
                    const defaultRows = getDefaultLeaderboard();
                    setRows(defaultRows);
                    setProgressById(
                        Object.fromEntries(
                            defaultRows.map((row) => [row.id, progressWithLeaderboardFallback(row)])
                        )
                    );
                    setStatus(`Could not load live storage: ${error.message}`);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        loadMembers();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if (!selectedEditRow) {
            return;
        }

        setEditId(selectedEditRow.id);
        setEditProgress(progressById[selectedEditRow.id] || progressWithLeaderboardFallback(selectedEditRow));
    }, [progressById, selectedEditRow]);

    const handleLogout = () => {
        localStorage.removeItem("loggedInAs");
        navigate("/");
    };

    const updateEditProgress = (key, value) => {
        setEditProgress((current) => ({
            ...current,
            [key]: getNumber(value),
        }));
    };

    const handleSaveProgress = async () => {
        if (!selectedEditRow) {
            return;
        }

        if (!isLiveStorageConfigured) {
            alert(FIREBASE_SETUP_MESSAGE);
            return;
        }

        const nextProgress = {
            ...editProgress,
            rp: getNumber(editProgress.rp),
            ap: getNumber(editProgress.ap),
            skillsCompleted: countSkills(editProgress),
        };

        setIsSaving(true);

        try {
            const savedProgress = await saveUserProgress(
                selectedEditRow.id,
                selectedEditRow.displayName,
                nextProgress
            );
            const leaderboard = await getLeaderboard(getDefaultLeaderboard());

            setRows(leaderboard);
            setProgressById((current) => ({
                ...current,
                [selectedEditRow.id]: savedProgress,
            }));
            setStatus("");
            alert("Admin progress update saved");
        } catch (error) {
            setStatus(`Could not save progress: ${error.message}`);
            alert("Unable to save progress. Check Firebase setup and Firestore rules.");
        } finally {
            setIsSaving(false);
        }
    };

    const toggleProjectMember = (memberId) => {
        setProjectForm((current) => {
            const exists = current.members.includes(memberId);
            return {
                ...current,
                members: exists
                    ? current.members.filter((id) => id !== memberId)
                    : [...current.members, memberId],
            };
        });
    };

    const handleCreateProject = () => {
        const name = projectForm.name.trim();

        if (!name) {
            alert("Please enter a project name.");
            return;
        }

        const nextProject = {
            id: `project_${Date.now()}`,
            name,
            deadline: projectForm.deadline,
            description: projectForm.description.trim(),
            tasks: projectForm.tasks
                .split("\n")
                .map((task) => task.trim())
                .filter(Boolean)
                .map((task) => ({ name: task, done: false })),
            members: projectForm.members.map((memberId) => {
                const member = rows.find((row) => row.id === memberId);
                return {
                    id: memberId,
                    name: member?.displayName || memberId,
                    role: roles[memberId]?.trim() || "Member",
                };
            }),
        };
        const nextProjects = [...projects, nextProject];

        setProjects(nextProjects);
        writeProjects(nextProjects);
        setProjectForm({ name: "", deadline: "", description: "", tasks: "", members: [] });
        setRoles({});
    };

    const handleDeleteProject = (projectId) => {
        if (!confirm("Delete this project?")) {
            return;
        }

        const nextProjects = projects.filter((project) => project.id !== projectId);
        setProjects(nextProjects);
        writeProjects(nextProjects);
    };

    const getProjectStatus = (project) => {
        const totalTasks = project.tasks.length;
        const doneTasks = project.tasks.filter((task) => task.done).length;
        const percent = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;

        if (percent === 100) {
            return { label: "Completed", className: "admin-status-completed", percent };
        }

        if (percent > 0) {
            return { label: "In Progress", className: "admin-status-progress", percent };
        }

        return { label: "Not Started", className: "admin-status-start", percent };
    };

    const selectedProgress = selectedRow
        ? progressById[selectedRow.id] || progressWithLeaderboardFallback(selectedRow)
        : null;

    return (
        <div className="admin-page">
            <header className="admin-header">
                <div>
                    <p className="admin-kicker">Admin Panel</p>
                    <h1>Team Progress Management</h1>
                </div>
                <button className="admin-logout" onClick={handleLogout}>Logout</button>
            </header>

            {status && <p className="admin-status-message">{status}</p>}

            <nav className="admin-tabs" aria-label="Admin sections">
                <button
                    className={activeTab === "members" ? "active" : ""}
                    onClick={() => setActiveTab("members")}
                >
                    Members
                </button>
                <button
                    className={activeTab === "projects" ? "active" : ""}
                    onClick={() => setActiveTab("projects")}
                >
                    Projects
                </button>
            </nav>

            {activeTab === "members" ? (
                <main className="admin-section">
                    <div className="admin-stats">
                        <div>
                            <strong>{totals.members}</strong>
                            <span>Total Members</span>
                        </div>
                        <div>
                            <strong>{totals.rewardpoints.toLocaleString()}</strong>
                            <span>Total Reward Points</span>
                        </div>
                        <div>
                            <strong>{totals.activitypoints.toLocaleString()}</strong>
                            <span>Total Activity Points</span>
                        </div>
                        <div>
                            <strong>{projects.length}</strong>
                            <span>Total Projects</span>
                        </div>
                    </div>

                    <section className="admin-table-section">
                        <div className="admin-section-title">All Members</div>
                        <div className="admin-table">
                            <div className="admin-table-row admin-table-head">
                                <span>S.No</span>
                                <span>Name</span>
                                <span>Roll No</span>
                                <span>Skills</span>
                                <span>Reward</span>
                                <span>Activity</span>
                                <span>Action</span>
                            </div>
                            {isLoading ? (
                                <p className="admin-empty">Loading members...</p>
                            ) : (
                                rows.map((row, index) => {
                                    const rowProgress = progressById[row.id] || progressWithLeaderboardFallback(row);

                                    return (
                                        <div className="admin-table-row" key={row.id}>
                                            <span>{index + 1}</span>
                                            <span>{row.displayName}</span>
                                            <span>{row.id.toUpperCase()}</span>
                                            <span>{rowProgress.skillsCompleted}</span>
                                            <span>{row.rewardpoints.toLocaleString()}</span>
                                            <span>{row.activitypoints.toLocaleString()}</span>
                                            <span>
                                                <button className="admin-small-btn" onClick={() => setSelectedRow(row)}>
                                                    View
                                                </button>
                                            </span>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </section>

                    <section className="admin-edit-panel">
                        <div className="admin-section-title">Update Student Progress</div>
                        <label>
                            Student
                            <select value={editId} onChange={(event) => setEditId(event.target.value)}>
                                {rows.map((row) => (
                                    <option key={row.id} value={row.id}>
                                        {row.displayName} ({row.id.toUpperCase()})
                                    </option>
                                ))}
                            </select>
                        </label>
                        <div className="admin-edit-grid">
                            {SKILLS.map((skill) => (
                                <label key={skill.key}>
                                    {skill.label}
                                    <input
                                        type="number"
                                        min="0"
                                        max={skill.max}
                                        value={editProgress[skill.key] || 0}
                                        onChange={(event) => updateEditProgress(skill.key, event.target.value)}
                                    />
                                    <small>Max {skill.max}</small>
                                </label>
                            ))}
                            <label>
                                Reward Points
                                <input
                                    type="number"
                                    min="0"
                                    value={editProgress.rp || 0}
                                    onChange={(event) => updateEditProgress("rp", event.target.value)}
                                />
                            </label>
                            <label>
                                Activity Points
                                <input
                                    type="number"
                                    min="0"
                                    value={editProgress.ap || 0}
                                    onChange={(event) => updateEditProgress("ap", event.target.value)}
                                />
                            </label>
                        </div>
                        <button className="admin-primary-btn" onClick={handleSaveProgress} disabled={isSaving}>
                            {isSaving ? "Saving..." : "Save Progress"}
                        </button>
                    </section>
                </main>
            ) : (
                <main className="admin-section">
                    <section>
                        <div className="admin-section-title">All Projects</div>
                        <div className="admin-projects-grid">
                            {projects.length === 0 ? (
                                <p className="admin-empty">No projects yet. Create one below.</p>
                            ) : (
                                projects.map((project) => {
                                    const statusInfo = getProjectStatus(project);

                                    return (
                                        <article className="admin-project-card" key={project.id}>
                                            <div className="admin-project-card-head">
                                                <div>
                                                    <h2>{project.name}</h2>
                                                    <p>{project.deadline || "No deadline"}</p>
                                                </div>
                                                <span className={statusInfo.className}>{statusInfo.label}</span>
                                            </div>
                                            {project.description && <p>{project.description}</p>}
                                            <div className="admin-progress-track">
                                                <div style={{ width: `${statusInfo.percent}%` }}></div>
                                            </div>
                                            <p>{statusInfo.percent}% complete</p>
                                            <div className="admin-chip-row">
                                                {project.members.map((member) => (
                                                    <span key={`${project.id}-${member.id}`}>{member.name} - {member.role}</span>
                                                ))}
                                            </div>
                                            <button className="admin-danger-btn" onClick={() => handleDeleteProject(project.id)}>
                                                Delete
                                            </button>
                                        </article>
                                    );
                                })
                            )}
                        </div>
                    </section>

                    <section className="admin-create-project">
                        <div className="admin-section-title">Create New Project</div>
                        <div className="admin-form-grid">
                            <label>
                                Project Name
                                <input
                                    value={projectForm.name}
                                    onChange={(event) => setProjectForm((current) => ({ ...current, name: event.target.value }))}
                                />
                            </label>
                            <label>
                                Deadline
                                <input
                                    type="date"
                                    value={projectForm.deadline}
                                    onChange={(event) => setProjectForm((current) => ({ ...current, deadline: event.target.value }))}
                                />
                            </label>
                        </div>
                        <label>
                            Description
                            <textarea
                                value={projectForm.description}
                                onChange={(event) => setProjectForm((current) => ({ ...current, description: event.target.value }))}
                            />
                        </label>
                        <label>
                            Tasks
                            <textarea
                                placeholder="Write one task per line"
                                value={projectForm.tasks}
                                onChange={(event) => setProjectForm((current) => ({ ...current, tasks: event.target.value }))}
                            />
                        </label>
                        <div className="admin-member-assign">
                            {rows.map((row) => (
                                <div key={row.id}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={projectForm.members.includes(row.id)}
                                            onChange={() => toggleProjectMember(row.id)}
                                        />
                                        {row.displayName}
                                    </label>
                                    <input
                                        placeholder="Role"
                                        value={roles[row.id] || ""}
                                        onChange={(event) => setRoles((current) => ({ ...current, [row.id]: event.target.value }))}
                                    />
                                </div>
                            ))}
                        </div>
                        <button className="admin-primary-btn" onClick={handleCreateProject}>Create Project</button>
                    </section>
                </main>
            )}

            {selectedRow && selectedProgress && (
                <div className="admin-modal-backdrop" role="dialog" aria-modal="true">
                    <div className="admin-modal">
                        <button className="admin-modal-close" onClick={() => setSelectedRow(null)}>Close</button>
                        <h2>{selectedRow.displayName}</h2>
                        <p><strong>Roll No:</strong> {selectedRow.id.toUpperCase()}</p>
                        <p><strong>Skills Completed:</strong> {selectedProgress.skillsCompleted}</p>
                        <p><strong>Reward Points:</strong> {selectedProgress.rp.toLocaleString()}</p>
                        <p><strong>Activity Points:</strong> {selectedProgress.ap.toLocaleString()}</p>
                        <div className="admin-skill-list">
                            {SKILLS.map((skill) => {
                                const value = selectedProgress[skill.key] || 0;
                                const percent = Math.min(100, (value / skill.max) * 100);

                                return (
                                    <div key={skill.key}>
                                        <span>{skill.label}</span>
                                        <div className="admin-skill-bar">
                                            <div style={{ width: `${percent}%` }}></div>
                                        </div>
                                        <span>{value}/{skill.max}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
