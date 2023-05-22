import React from 'react'
import { Link } from 'react-router-dom';
import "./404.css"
const NotFoundPage = () => {
    const role = localStorage.getItem('role');
    console.log('rolerole', role)
    const navgateTo = role === 'student' ? "/student" : role === 'teacher' ? "/professor" : role === 'admin' ? "/admin" : "/";
    return (
        <div className="layout-404">
            <h1 className='number-404'>404</h1>
            <p className='pharagraph-404'>Oops! Something is wrong.</p>
            <Link className="button-404" to={`${navgateTo}`}><i className="icon-home"></i> Go back in initial page, is better.</Link>
        </div >
    )
}

export default NotFoundPage;