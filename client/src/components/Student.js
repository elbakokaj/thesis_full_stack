import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import '../css/Student.css';
import 'boxicons/css/boxicons.min.css';
import { Pie } from 'react-chartjs-2';
import axios from "../axios"
const Student = () => {
    const [showAccountSettings, setShowAccountSettings] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [showContentText, setShowContentText] = useState(true);
    const [contentToShow, setContentToShow] = useState('');
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [pieChartData, setPieChartData] = useState(null);
    const [courses, setCourses] = useState([]);
    const [showChangePassword, setShowChangePassword] = useState(false);

    const [editBody, setEditBody] = useState({
        firstName: "",
        lastName: "",
        birthday: "",
        yearOfEnrollment: ""
    });

    const handleProfileChange = (e, type) => {
        const { name, value } = e.target;

        // Update the editBody object based on the input change
        setEditBody(prevEditBody => ({ ...prevEditBody, [type]: value }));
    };

    async function handleEditPost(e) {
        e.preventDefault();
        await axios.put(`/profile/edit/${student_id}`, editBody)
            .then((res) => {
                console.log('resPUT', res)
            })
            .catch(err =>
                alert("Error:" + err)
            )
    }
    console.log('editBody', editBody)
    const toggleAccountSettings = () => {
        setShowAccountSettings(!showAccountSettings);
    };


    // stats to get data from API'S
    const [userData, setUserData] = useState(null)


    console.log("resprofile", userData)

    const student_id = window.localStorage.getItem("user_id")
    const toggleProfile = async (e) => {
        e.preventDefault();
        if (contentToShow !== 'profile') {
            await axios.get(`/profile/${student_id}`)
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

    const handleLogout = () => {
        // Perform any logout actions, e.g., remove tokens, clear user data
        window.localStorage.clear()
        window.location.assign('/');
    };

    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);
    };

    const toggleCourses = async () => {
        await axios.get(`/courses/course_name/${student_id}`)
            .then((res) => {
                setCourses(res.data)
                console.log('allCourses', res.data)
            })
            .catch(err =>

                alert("Error: " + err.response.data)

            )
        if (contentToShow !== 'courses') {
            setContentToShow('courses');
            setShowContentText(false);
        } else {
            setContentToShow('');
            setShowContentText(true);
        }
    };

    const renderCourses = () => {
        return (

            courses?.map((el) => (
                < div
                    key={el?._id}
                    className="course-row course-box"
                    onClick={() => displayCourseStats(el._id, el?.course_date)}
                    data-testId="courseRow"
                >
                    <div className="course-name">{el?.name}</div>
                </div >
            )))
    };


    const displayCourseStats = async (course_id, course_date) => {
        const attendedClasses = [];
        const missedClasses = [];
        const body = {
            course_id: course_id,
            student_id: student_id,
            course_date: course_date
        }
        await axios.get(`/attendances/find_specific_status`, { params: body })
            .then((res) => {
                console.log('body', body)
                attendedClasses.push(res?.data?.present);
                missedClasses.push(res?.data?.absent);
                setSelectedCourse(res.data?._id)
                console.log('res.dataramadani', res.data)

            })
            .catch(err =>
                alert("Error:" + err)
            )
        console.log('classesa', attendedClasses)
        console.log('classesm', missedClasses)



        setPieChartData({
            labels: ['Attended', 'Missed'],
            datasets: [
                {
                    data: [attendedClasses[0], missedClasses[0]],
                    backgroundColor: ['#4BC0C0', '#FF6384'],
                    hoverBackgroundColor: ['#4BC0C0', '#FF6384'],
                },
            ],
        });
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
        // ndrrimi i passit
        e.preventDefault();
        const body = {
            old_password: oldPass,
            new_password: newPass
        }
        if (oldPass == newPass) {
            alert("Old password can not be the same as new password!")
        }
        else if (oldPass !== newPass) {
            await axios.put(`/profile/change_password/${student_id}`, body)
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

    console.log('old pass ', oldPass)
    console.log('old pass ', newPass)
    const handlePasswordText = (e, type) => {
        if (type == "currentPassword") {
            setOldPass(e.target.value)
        }
        if (type == "newPassword") {
            setNewPass(e.target.value)
        }

    }
    return (
        <div className='studentPage'>

            <div className='dashboard-student'>
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
            <div className='content-ofStudent'>
                {contentToShow === 'profile' && (
                    <div className={`student-profile ${isEditMode ? "edit-mode" : ""}`}>
                        {isEditMode ? (
                            // Edit form
                            <form onSubmit={handleEditPost}>
                                <h2 data-testId="edit-header">Edit Profile</h2>
                                <label>
                                    Name: <input type="text" name='name' defaultValue={userData?.firstName} onChange={(e) => handleProfileChange(e, "firstName")} />
                                </label>
                                <label>
                                    Surname: <input type="text" name='surname' defaultValue={userData?.lastName} onChange={(e) => handleProfileChange(e, "lastName")} />
                                </label>
                                <label>
                                    Birthday: <input type="date" name='birthday' defaultValue={userData?.birthday.substring(0, 10)} onChange={(e) => handleProfileChange(e, "birthday")} />
                                </label>
                                <label>
                                    Year of Enrollment: <input type="text" name='yearEnrolled' defaultValue={userData?.yearOfEnrollment} onChange={(e) => handleProfileChange(e, "yearOfEnrollment")} />
                                </label>

                                <button type='submit'>Save Changes</button>
                                <button type='button' onClick={toggleEditMode}>Cancel</button>
                            </form>
                        ) : (
                            // Profile view
                            <>
                                <h2 data-testId="student-prof">Student Profile</h2>
                                <p><strong>Name:</strong> {userData?.firstName}</p>
                                <p><strong>Surname:</strong> {userData?.lastName}</p>
                                <p><strong>Birthday:</strong> {userData?.birthday.substring(0, 10)}</p>
                                <p><strong>Year of Enrollment:</strong> {userData?.yearOfEnrollment}</p>
                                {/* Add Edit button */}
                                <button className="edit-profile-btn" onClick={toggleEditMode}>Edit Profile</button>
                                <button className="change-password-btn" onClick={toggleChangePassword}>Change Password</button>
                            </>
                        )}
                    </div>
                )}

                {!showProfile && showContentText && (
                    <div className='content-text-ofStudent'>
                        <p>Welcome to your student dashboard!</p>
                        <p>Here you can access all of your important information and resources.</p>
                    </div>
                )}
                {!showProfile && !showContentText && contentToShow === 'courses' && (
                    <div className="coursesToShow" data-testid="coursesToShow">
                        {selectedCourse === null ? (
                            renderCourses()
                        ) : (
                            pieChartData && (

                                <div class="pie-chart-container" data-testid="pieChartContainer">
                                    <div class="pie-chart-content" data-testid="pieChartContent">
                                        <div className="course-stats" data-testId="course-stats">
                                            <h3>Course Statistics</h3>
                                            <Pie data={pieChartData} />
                                        </div>
                                        <div className='wrapperOfButton'>
                                            <h4>Hover on the chart to see the number of you missed or attended classes</h4>
                                        </div>
                                    </div>
                                    <button className='back-to-courses-button' onClick={() => setSelectedCourse(null)}>Go back to courses list</button>
                                </div>

                            )
                        )}


                    </div>
                )}
                {!showProfile && !showContentText && contentToShow === 'changePassword' && (
                    <div className="change-password-form student-profile">
                        <h2 data-testId="change-password-header">Change Password</h2>
                        <form onSubmit={handlePasswordChange}>
                            <label>
                                Current Password: <input name='currentPassword' onChange={(e) => handlePasswordText(e, "currentPassword")} />
                            </label>
                            <label>
                                New Password: <input name='newPassword' onChange={(e) => handlePasswordText(e, "newPassword")} />
                            </label>
                            <button type="submit">Save Changes</button>
                            <button type="button" onClick={toggleProfile}>Cancel</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Student;
