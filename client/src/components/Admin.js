import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../css/Admin.css';
import 'boxicons/css/boxicons.min.css';
import { useNavigate } from 'react-router-dom';
import axios from "../axios"
// import sign from 'jwt-encode';


const Admin = () => {
    // console.error('shabangashi', sign('1234', "marinairPopaj"))
    const [students, setStudents] = useState([]);
    const [showProfile, setShowProfile] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [contentToShow, setContentToShow] = useState('');
    const [showContentText, setShowContentText] = useState(true);
    const [selectedSemester, setSelectedSemester] = useState(null);
    const [dates, setDates] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [attendance, setAttendance] = useState([]);
    const [showSemesters, setShowSemesters] = useState(false);
    const navigate = useNavigate();
    const [showChangePassword, setShowChangePassword] = useState(false);
    const handleLogout = () => {
        window.localStorage.clear()
        window.location.assign('/');
    };


    const [editBody, setEditBody] = useState({
        firstName: "",
        lastName: "",
        birthday: ""
    });
    const handleProfileChange = (e, type) => {
        const { name, value } = e.target;

        setEditBody(prevEditBody => ({ ...prevEditBody, [type]: value }));
    };

    async function handleEditPost(e) {
        e.preventDefault();
        await axios.put(`/profile/edit/${admin_id}`, editBody)
            .then((res) => {
                console.log('resPUT', res)
            })
            .catch(err =>
                alert("Error:" + err)
            )
    }

    const [userData, setUserData] = useState(null)

    const admin_id = window.localStorage.getItem("user_id")

    const toggleProfile = async (e) => {
        e.preventDefault();
        if (contentToShow !== 'profile') {
            await axios.get(`/profile/${admin_id}`)
                .then((res) => {
                    setUserData(res.data[0])


                })
                .catch(err =>
                    alert("Error:" + err)
                )
            setContentToShow('profile');
            setShowContentText(false);
            setShowChangePassword(false);

        } else {
            setContentToShow('');
            setShowContentText(true);
        }
    };

    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);
    };


    const [professors, setProfessors] = useState()
    const toggleCourses = async () => {
        setContentToShow('courses');
        setShowContentText(false);
        setSelectedSemester(null);
        setSelectedDate(null);
        setSelectedGroup(null);
        setSelectedDate(null);
        await axios.get(`users/find_all_professors`)
            .then((res) => {
                setProfessors(res?.data)


            })
            .catch(err =>
                alert("Error:" + err)
            )

    };

    const onSelectSemester = async (professor_id) => {
        setShowSemesters(false);
        setSelectedSemester(professor_id);
        await axios.get(`courses/find_specific_course/${professor_id}`)
            .then((res) => {
                setDates(res?.data?.attendance_dates);
                console.log('datat qe duhet tshfaqur', res?.data?.attendance_dates)
            })
            .catch(err =>
                alert("Error:" + err)
            )
    };

    const handleAttendance = (student, status) => {
        console.log(student, status)
        const updatedStudent = { ...student, status: status };
        const updatedStudents = students.map((s) =>
            s._id === student._id ? updatedStudent : s
        );
        setStudents(updatedStudents);


    };
    console.log('hahaishasd', students)

    const DateSelection = ({ dates, selectedSemester, setSelectedDate }) => {
        console.log('ramadan pireva', dates, selectedSemester, setSelectedDate)
        const handleDateClick = (course) => {
            setSelectedDate(course);
        };

        return (
            <div >
                <ul>
                    {dates?.map((date, index) => (
                        <li className="listDates" data-testid={`date-${index}`} key={date?.id} onClick={() => handleDateClick(date)}>
                            {date?.date.slice(0, 10)}
                        </li>
                    ))}
                </ul>
            </div>
        );
    };
    const updateAttendance = async (selectedDate, students) => {
        const courseId = selectedDate?.courseId
        const groupId = selectedDate?.groupId
        const date = selectedDate?.date
        var test1 = []
        for (let index = 0; index < students.length; index++) {
            test1.push({ studentId: students[index]?.studentId?._id, status: students[index]?.status })

        }
        const body = {
            courseId: courseId,
            groupId: groupId,
            date: date,
            records: test1
        }
        console.log('hej hej ', body)

        await axios.put(`attendances/update_attendance_records`, body)
            .then((res) => {
                console.log('responsi pozitiv', res)
            })
            .catch(err =>
                alert("Error:" + err)
            )

    }

    const AttendanceList = ({ attendance, setAttendance, students }) => {
        return (
            <div className="attendance-list" data-testid="attendance-list" >
                <h2>Attendance List</h2>
                <table>
                    <thead>
                        <tr >
                            <th>Name</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students?.map((student, index) => {
                            console.log('studentGashi5672123', attendance, students)
                            return (
                                <tr key={student.id} data-testid={`student-${student.id}`}>
                                    <td>{student?.studentId?.firstName + " " + student?.studentId?.lastName}</td>
                                    <td>
                                        <div className="attendance-status" data-testid={`attendance-status-${index}`}>
                                            <button
                                                data-testid={`attendance-${index}-status-present`}
                                                className={`status-btn ${student?.status?.includes('present') ? 'present' : ''}`}
                                                onClick={() => handleAttendance(student, 'present')}
                                            >
                                                Present
                                            </button>
                                            <button
                                                data-testid={`attendance-${index}-status-excused`}
                                                className={`status-btn ${student?.status?.includes('excused') ? 'excused' : ''}`}
                                                onClick={() => handleAttendance(student, 'excused')}
                                            >
                                                Excused
                                            </button>
                                            <button
                                                data-testid={`attendance-${index}-status-absent`}
                                                className={`status-btn ${student?.status?.includes('absent') ? 'absent' : ''}`}
                                                onClick={() => handleAttendance(student, 'absent')}
                                            >
                                                Absent
                                            </button>

                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <button className='saveAttendanceButton' onClick={() => updateAttendance(selectedDate, students)}>Save Attendance</button>
            </div>
        );
    };

    const toggleChangePassword = () => {
        if (contentToShow !== 'changePassword') {
            setContentToShow('changePassword');
            setShowContentText(false);
        } else {
            setContentToShow('');
            setShowContentText(true);
        }
    };
    const handlePasswordChange = async (e) => {
        e.preventDefault();
        const body = {
            old_password: oldPass,
            new_password: newPass
        }
        if (oldPass == newPass) {
            alert("Old password can not be the same as new password!")
        }
        else if (oldPass !== newPass) {
            await axios.put(`/profile/change_password/${admin_id}`, body)
                .then((res) => {
                    if (res?.data?.message == "Old passwords do not match!") {
                        alert(res?.data?.message)
                    } else if ("Password changed sucesfully!") {
                        alert("Password changed successfully!")
                    }
                })
                .catch((error) => {
                    if (error.response) {
                        const message = error.response.data.error;
                        alert(`Error: ${message}`);
                    } else if (error.request) {
                        alert("Error: The server did not respond. Please try again later.");
                    } else {
                        alert("Error: An unexpected error occurred.");
                    }
                });
        }
    };
    const [oldPass, setOldPass] = useState("")
    const [newPass, setNewPass] = useState("")
    console.log('passwordat1', oldPass, newPass)
    const handlePasswordText = (e, type) => {
        if (type == "currentPassword") {
            setOldPass(e.target.value)
        }
        if (type == "newPassword") {
            setNewPass(e.target.value)
        }

    }

    return (
        <div className='adminPage'>

            <div className='dashboard-admin'>
                <header>
                    <h1 className='welcome'>Welcome!</h1>
                </header>

                <ul className="nav-links">
                    <li onClick={toggleProfile}>
                        <a href="#">
                            <i className='bx bx-user' ></i>
                            <span className="links_name">Profile</span>
                        </a>
                    </li>
                    <li onClick={toggleCourses}>
                        <a href="#">
                            <i className='bx bx-grid-alt' ></i>
                            <span className="links_name">Courses</span>
                        </a>
                    </li>
                    <li onClick={handleLogout}>
                        <a href="#">
                            <i className='bx bx-log-out'></i>
                            <span className="links_name">Log out</span>
                        </a>
                    </li>
                </ul>

            </div>
            <div className='content-ofAdmin'>
                {contentToShow === 'profile' && (
                    <div className={`admin-profile ${isEditMode ? "edit-mode" : ""}`}>
                        {isEditMode ? (
                            // Edit form
                            <form onSubmit={handleEditPost}>
                                <h2 data-testid="edit-header">Edit Profile</h2>
                                <label>
                                    Name: <input type="text" name='name' defaultValue={userData?.firstName} onChange={(e) => handleProfileChange(e, "firstName")} />
                                </label>
                                <label>
                                    Surname: <input type="text" name='surname' defaultValue={userData?.lastName} onChange={(e) => handleProfileChange(e, "lastName")} />
                                </label>
                                <label>
                                    Birthday: <input type="date" name='birthday' defaultValue={userData?.birthday.substring(0, 10)} onChange={(e) => handleProfileChange(e, "birthday")} />
                                </label>
                                <button type='submit'>Save Changes</button>
                                <button type='button' onClick={toggleEditMode}>Cancel</button>
                            </form>
                        ) : (
                            <>
                                <h2 data-testid="admin-prof">Admin Profile</h2>
                                <p><strong>Name:</strong> {userData?.firstName}</p>
                                <p><strong>Surname:</strong> {userData?.lastName}</p>
                                <p><strong>Birthday:</strong> {userData?.birthday.substring(0, 10)}</p>
                                <button className="edit-profile-btn" onClick={toggleEditMode}>Edit Profile</button>
                                <button className="change-password-btn" onClick={toggleChangePassword}>Change Password</button>

                            </>
                        )}
                    </div>
                )}
                {!showProfile && showContentText && !showSemesters && (
                    <div className='content-text-ofAdmin'>
                        <p>Welcome to your admin dashboard!</p>
                        <p>Here you can access all of your important information and resources.</p>
                    </div>
                )}

                {!selectedDate && contentToShow === 'courses' && (
                    <div className='semesterSelection' data-testId="semesterSelection">
                        <div className="white-box">
                            <h2>Select Professor</h2>
                            <ul>
                                {console.log('profesors', professors)}
                                {professors?.map((prof, index) => (
                                    <button data-testid={`prof-${index}`} key={index} className="change-password-btn" onClick={() => onSelectSemester(prof?._id)} > {prof?.firstName} {prof?.lastName} / {prof?.course}</button>
                                ))}
                            </ul>
                        </div>
                        {selectedSemester !== null && (
                            <div className="white-box" data-testid="datesSelection">
                                <h2>Select Date</h2>
                                <DateSelection dates={dates} date_id={dates?._id} setSelectedDate={date => { setStudents(date?.records); setSelectedDate(date); setContentToShow('attendance') }} />
                            </div>
                        )}
                    </div>
                )}

                {contentToShow === 'attendance' && selectedDate !== null && (
                    <AttendanceList attendance={attendance} setAttendance={setAttendance} students={students} />
                )}

                {!showProfile && !showContentText && contentToShow === 'changePassword' && (
                    <div className="change-password-form student-profile">
                        <h2 data-testid="change-password-header">Change Password</h2>
                        <form onSubmit={handlePasswordChange}>
                            <label>
                                Current Password: <input type="password" name='currentPassword' onChange={(e) => handlePasswordText(e, "currentPassword")} />
                            </label>
                            <label>
                                New Password: <input type="password" name='newPassword' onChange={(e) => handlePasswordText(e, "newPassword")} />
                            </label>
                            <button type="submit" >Save Changes</button>
                            <button type='button' onClick={toggleProfile}>Cancel</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;
