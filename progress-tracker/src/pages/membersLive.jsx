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

function getShortSkillLabel(label) {
    return label
        .replace(" programming", "")
        .replace("System Administration", "Sys Admin")
        .replace("Computer Networking", "Networks")
        .replace("Java Script", "JS")
        .replace("Git Hub", "GitHub");
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
    const chartMax = Math.max(...SKILLS.map((skill) => skill.max));
    const chartTop = 24;
    const chartBottom = 206;
    const chartLeft = 58;
    const barStep = 65;
    const barWidth = 32;
    const chartScale = (chartBottom - chartTop) / chartMax;
    const chartTicks = [chartMax, Math.ceil(chartMax / 2), 0];

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
                        <div className="members-chart-heading">
                            <h2>Skill Progress Overview</h2>
                            <div className="members-chart-legend">
                                <span><i className="is-complete"></i>Completed</span>
                                <span><i className="is-remaining"></i>Remaining</span>
                            </div>
                        </div>
                        {isLoading ? (
                            <p className="loading-panel">Loading live progress...</p>
                        ) : (
                            <div className="members-chart-wrap">
                                <svg className="members-skill-chart" viewBox="0 0 680 270" role="img" aria-label="Skill progress overview chart">
                                    {chartTicks.map((tick) => {
                                        const y = chartBottom - tick * chartScale;

                                        return (
                                            <g key={tick}>
                                                <text className="members-axis-label" x="42" y={y + 4}>{tick}</text>
                                                <line className="members-grid-line" x1="58" y1={y} x2="650" y2={y} />
                                            </g>
                                        );
                                    })}
                                    <line className="members-axis-line" x1="58" y1={chartTop} x2="58" y2={chartBottom} />
                                    <line className="members-axis-line" x1="58" y1={chartBottom} x2="650" y2={chartBottom} />
                                    {SKILLS.map((skill, index) => {
                                        const value = Number(progress[skill.key]) || 0;
                                        const completed = Math.min(value, skill.max);
                                        const remaining = Math.max(0, skill.max - completed);
                                        const completedHeight = completed * chartScale;
                                        const remainingHeight = remaining * chartScale;
                                        const x = chartLeft + 28 + index * barStep;
                                        const yRemaining = chartBottom - completedHeight - remainingHeight;
                                        const yCompleted = chartBottom - completedHeight;

                                        return (
                                            <g className="members-chart-bar" key={skill.key}>
                                                <title>{`${skill.label}: ${completed} of ${skill.max}`}</title>
                                                {remaining > 0 && (
                                                    <rect
                                                        className="members-bar-remaining"
                                                        x={x}
                                                        y={yRemaining}
                                                        width={barWidth}
                                                        height={remainingHeight}
                                                        rx="7"
                                                    />
                                                )}
                                                {completed > 0 && (
                                                    <rect
                                                        className="members-bar-complete"
                                                        x={x}
                                                        y={yCompleted}
                                                        width={barWidth}
                                                        height={completedHeight}
                                                        rx="7"
                                                    />
                                                )}
                                                <text className="members-bar-value" x={x + barWidth / 2} y={yRemaining - 8}>
                                                    {completed}/{skill.max}
                                                </text>
                                                <text className="members-bar-label" x={x + barWidth / 2} y="240">
                                                    {getShortSkillLabel(skill.label)}
                                                </text>
                                            </g>
                                        );
                                    })}
                                </svg>
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
