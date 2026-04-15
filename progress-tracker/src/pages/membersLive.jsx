import "./members.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import A from "../assets/A.jpg";
import D from "../assets/D.jpg";
import G from "../assets/G.jpg";
import H from "../assets/H.jpg";
import K from "../assets/K.jpg";
import N from "../assets/N.jpg";
import P from "../assets/P.jpg";
import R from "../assets/R.jpg";
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

    const profile = { A, D, G, H, K, N, P, R };

    const getprofileimage = (studentName) => {
        if (studentName) {
            const firstletter = studentName.trim()[0].toUpperCase();
            return profile[firstletter];
        }
    };

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

    if (!userId || !student) {
        return null;
    }

    return (
        <>
            <div className="header">
                <div className="image">
                    <img className="imagetext" src={getprofileimage(name)} alt="profile" />
                </div>
                <div className="name">
                    <p className="name1">Welcome {name}</p>
                    <p className="name2">overall dashboard</p>
                </div>
            </div>
            {storageError && <p className="storage-status storage-error">{storageError}</p>}
            <div className="main-content">
                <div className="box-1">
                    <p className="box1-title">Your Progress</p>
                    <div className="box1">
                        <p className="box1-name" style={{ fontWeight: "bold", fontSize: "large", fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif" }}>
                            {progress.skillsCompleted}
                        </p>
                        <p className="box1-name">Skill Completed</p>
                    </div>
                    <div className="box1">
                        <p className="box1-name" style={{ fontWeight: "bold", fontSize: "large", fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif" }}>
                            {progress.rp.toLocaleString()}
                        </p>
                        <p className="box1-name">Reward Points</p>
                    </div>
                    <div className="box1">
                        <p className="box1-name" style={{ fontWeight: "bold", fontSize: "large", fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif" }}>
                            {progress.ap.toLocaleString()}
                        </p>
                        <p className="box1-name">Activity Points</p>
                    </div>
                </div>
                <div className="box-2">
                    <p className="box2-title">Update Your Progress</p>
                    <div className="box-3">
                        {isLoading ? (
                            <p className="loading-panel">Loading live progress...</p>
                        ) : (
                            <>
                                {SKILLS.map((skill) => (
                                    <div className="row" key={skill.key}>
                                        <p>{skill.label}</p>
                                        <div className="controls">
                                            <button onClick={() => updateSkill(skill, -1)}>-</button>
                                            <span>{progress[skill.key]}</span>
                                            <button onClick={() => updateSkill(skill, 1)}>+</button>
                                        </div>
                                        <div className="blue">{progress[skill.key]}</div>
                                        <div className="progress-bar">
                                            <div className="progress blue" style={{ width: getSkillWidth(skill) }}></div>
                                        </div>
                                        <p className="max">Max: {skill.max}</p>
                                    </div>
                                ))}
                                <div className="rp">
                                    <p>Reward point</p>
                                    <input
                                        type="number"
                                        placeholder="Enter Your RP"
                                        value={rpInput}
                                        onChange={(e) => setrpInput(e.target.value)}
                                    />
                                </div>
                                <div className="ap">
                                    <p>Activity point</p>
                                    <input
                                        type="number"
                                        placeholder="Enter Your AP"
                                        value={apInput}
                                        onChange={(e) => setapInput(e.target.value)}
                                    />
                                </div>
                                <center>
                                    <button className="saveprogress" onClick={handleSaveProgress} disabled={isSaving}>
                                        {isSaving ? "Saving..." : "Save Progress"}
                                    </button>
                                </center>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <p style={{ paddingLeft: "40px", marginBottom: "0px", paddingBottom: "10px", fontWeight: "bold", fontSize: "20px", color: "#11645d" }}>
                Leaderboard
            </p>
            <div className="leaderboard">
                <div className="leaderboard-row heading">
                    <p>S.No</p>
                    <p>Students</p>
                    <p>Reward Points</p>
                    <p>Activity Points</p>
                </div>
                {studentdata.map((studentRow, index) => (
                    <div
                        key={studentRow.id}
                        className="leaderboard-row student"
                        style={{ backgroundColor: studentRow.id === userId ? "#0080804D" : undefined }}
                    >
                        <p>{index + 1}</p>
                        <p>{studentRow.displayName}</p>
                        <p>{studentRow.rewardpoints.toLocaleString()}</p>
                        <p>{studentRow.activitypoints.toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </>
    );
}
