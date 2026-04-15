import "./members.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
    DEFAULT_PROGRESS,
    SKILLS,
    getDefaultLeaderboard,
    getStudentById,
    normalizeUserId,
} from "../data/students";
import {
    getLeaderboard,
    getUserProgress,
    isLiveStorageConfigured,
    saveUserProgress,
} from "../lib/progressStorage";

const FIREBASE_SETUP_MESSAGE =
    "Firebase live storage is not configured. Add VITE_FIREBASE_PROJECT_ID and VITE_FIREBASE_API_KEY in Vercel.";

function getInitials(displayName = "") {
    return displayName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("") || "P";
}

export default function MembersLive() {
    const location = useLocation();
    const navigate = useNavigate();
    const userId = useMemo(() => {
        const params = new URLSearchParams(location.search);
        return normalizeUserId(location.state?.id || params.get("user"));
    }, [location.search, location.state]);
    const student = getStudentById(userId);
    const name = (location.state?.name || student?.displayName || "").toUpperCase();

    const [progress, setProgress] = useState(DEFAULT_PROGRESS);
    const [rpInput, setrpInput] = useState("");
    const [apInput, setapInput] = useState("");
    const [studentdata, setstudentdata] = useState(getDefaultLeaderboard);
    const [isLoading, setisLoading] = useState(true);
    const [isSaving, setisSaving] = useState(false);
    const [storageError, setstorageError] = useState("");

    useEffect(() => {
        if (!userId || !student) {
            navigate("/", { replace: true });
            return;
        }

        let isMounted = true;

        async function loadLiveProgress() {
            setisLoading(true);

            if (!isLiveStorageConfigured) {
                if (isMounted) {
                    setstorageError(FIREBASE_SETUP_MESSAGE);
                    setstudentdata(getDefaultLeaderboard());
                    setisLoading(false);
                }
                return;
            }

            try {
                const [storedProgress, leaderboard] = await Promise.all([
                    getUserProgress(userId),
                    getLeaderboard(getDefaultLeaderboard()),
                ]);

                if (!isMounted) {
                    return;
                }

                setProgress(storedProgress);
                setrpInput(storedProgress.rp ? String(storedProgress.rp) : "");
                setapInput(storedProgress.ap ? String(storedProgress.ap) : "");
                setstudentdata(leaderboard);
                setstorageError("");
            } catch (error) {
                if (isMounted) {
                    setstorageError(`Could not load live storage: ${error.message}`);
                    setstudentdata(getDefaultLeaderboard());
                }
            } finally {
                if (isMounted) {
                    setisLoading(false);
                }
            }
        }

        loadLiveProgress();

        return () => {
            isMounted = false;
        };
    }, [navigate, student, userId]);

    const countSkillsCompleted = () => {
        return SKILLS.filter((skill) => progress[skill.key] >= 1).length;
    };

    const updateSkill = (skill, change) => {
        setProgress((currentProgress) => {
            const currentValue = Number(currentProgress[skill.key]) || 0;
            const nextValue = Math.min(skill.max, Math.max(0, currentValue + change));

            return {
                ...currentProgress,
                [skill.key]: nextValue,
            };
        });
    };

    const getSkillWidth = (skill) => {
        const currentValue = Number(progress[skill.key]) || 0;
        return `${Math.min(100, (currentValue / skill.max) * 100)}%`;
    };

    const getSkillPercent = (skill) => {
        const currentValue = Number(progress[skill.key]) || 0;
        return Math.round(Math.min(100, (currentValue / skill.max) * 100));
    };

    const handleSaveProgress = async () => {
        if (!isLiveStorageConfigured) {
            alert(FIREBASE_SETUP_MESSAGE);
            return;
        }

        const skills = countSkillsCompleted();
        const rp = parseInt(rpInput, 10) || 0;
        const ap = parseInt(apInput, 10) || 0;
        const nextProgress = {
            ...progress,
            rp,
            ap,
            skillsCompleted: skills,
        };

        setisSaving(true);

        try {
            const savedProgress = await saveUserProgress(userId, student.displayName, nextProgress);
            const leaderboard = await getLeaderboard(getDefaultLeaderboard());

            setProgress(savedProgress);
            setstudentdata(leaderboard);
            setstorageError("");

            alert("Progress saved to live storage");
        } catch (error) {
            setstorageError(`Could not save live storage: ${error.message}`);
            alert("Unable to save progress. Check Firebase setup and Firestore rules.");
        } finally {
            setisSaving(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("loggedInAs");
        navigate("/");
    };

    if (!userId || !student) {
        return null;
    }

    const completedSkills = countSkillsCompleted();
    const displayName = location.state?.name || student.displayName;

    return (
        <div className="members-page">
            <header className="members-header">
                <div className="members-header-left">
                    <div className="members-avatar">{getInitials(displayName)}</div>
                    <div>
                        <p className="members-header-name">Welcome, {name}</p>
                        <p className="members-header-sub">Overall Dashboard</p>
                    </div>
                </div>
                <div className="members-header-actions">
                    <span className="members-header-badge">PCDP Portal</span>
                    <button className="members-logout" onClick={handleLogout}>Logout</button>
                </div>
            </header>

            {storageError && <p className="storage-status storage-error">{storageError}</p>}

            <main className="members-content">
                <section className="members-top-row">
                    <div className="members-stats-card">
                        <h2>Your Progress</h2>
                        <div className="members-stats-grid">
                            <div className="members-stat-box">
                                <strong>{completedSkills}</strong>
                                <span>Skills Cleared</span>
                            </div>
                            <div className="members-stat-box">
                                <strong>{progress.rp.toLocaleString()}</strong>
                                <span>Reward Points</span>
                            </div>
                            <div className="members-stat-box">
                                <strong>{progress.ap.toLocaleString()}</strong>
                                <span>Activity Points</span>
                            </div>
                        </div>
                    </div>

                    <div className="members-progress-card">
                        <h2>Update Your Progress</h2>
                        {isLoading ? (
                            <p className="loading-panel">Loading live progress...</p>
                        ) : (
                            <>
                                {SKILLS.map((skill) => (
                                    <div className="members-skill-row" key={skill.key}>
                                        <span className="members-skill-name">{skill.label}</span>
                                        <div className="members-controls">
                                            <button onClick={() => updateSkill(skill, -1)}>-</button>
                                            <span>{progress[skill.key]}</span>
                                            <button onClick={() => updateSkill(skill, 1)}>+</button>
                                        </div>
                                        <div className="members-bar-wrap">
                                            <div className="members-bar-fill" style={{ width: getSkillWidth(skill) }}></div>
                                        </div>
                                        <span className="members-percent">{getSkillPercent(skill)}%</span>
                                    </div>
                                ))}
                                <button className="members-save" onClick={handleSaveProgress} disabled={isSaving}>
                                    {isSaving ? "Saving..." : "Save Progress"}
                                </button>
                            </>
                        )}
                    </div>
                </section>

                <section className="members-mid-row">
                    <div className="members-chart-card">
                        <h2>Skill Progress Overview</h2>
                        {isLoading ? (
                            <p className="loading-panel">Loading live progress...</p>
                        ) : (
                            <div className="members-chart-bars">
                                {SKILLS.map((skill) => (
                                    <div className="members-chart-row" key={skill.key}>
                                        <span>{skill.label}</span>
                                        <div className="members-chart-track">
                                            <div style={{ width: getSkillWidth(skill) }}></div>
                                        </div>
                                        <small>{progress[skill.key]}/{skill.max}</small>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="members-points-card">
                        <h2>Update Points</h2>
                        <label>
                            Reward Points
                            <span>Points earned from quests and badges</span>
                            <input
                                type="number"
                                placeholder="Enter reward points"
                                value={rpInput}
                                onChange={(e) => setrpInput(e.target.value)}
                            />
                        </label>
                        <label>
                            Activity Points
                            <span>Points from all learning activities</span>
                            <input
                                type="number"
                                placeholder="Enter activity points"
                                value={apInput}
                                onChange={(e) => setapInput(e.target.value)}
                            />
                        </label>
                        <button className="members-save" onClick={handleSaveProgress} disabled={isSaving}>
                            {isSaving ? "Saving..." : "Save Progress"}
                        </button>
                    </div>
                </section>

                <section className="members-leaderboard-card">
                    <h2>Leaderboard</h2>
                    <div className="members-table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Student</th>
                                    <th>Reward Points</th>
                                    <th>Activity Points</th>
                                </tr>
                            </thead>
                            <tbody>
                                {studentdata.map((studentRow, index) => (
                                    <tr key={studentRow.id} className={studentRow.id === userId ? "is-current" : ""}>
                                        <td><span className="members-rank">{index + 1}</span></td>
                                        <td>{studentRow.displayName}{studentRow.id === userId ? " (you)" : ""}</td>
                                        <td>{studentRow.rewardpoints.toLocaleString()}</td>
                                        <td>{studentRow.activitypoints.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    );
}
