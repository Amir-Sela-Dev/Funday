import React from 'react'
import { Routes, Route } from 'react-router'

import routes from './routes'

import { UserDetails } from './pages/user-details'
import { AppIndex } from './pages/app-index'
import { BoardDetails } from './cmps/board/board-details'
import { Login } from './pages/login'
import { HomePage } from './pages/home-page.jsx'
import { AboutUs } from './pages/about-us.jsx'

export function RootCmp() {

    return (
        <div>
            <main>
                <Routes>
                    {/* {routes.map(route => <Route key={route.path} exact={true} element={route.component} path={route.path} />)} */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="auth/login" element={<Login />} />
                    <Route path="user/:id" element={<UserDetails />} />
                    <Route path="/board" element={<AppIndex />} >
                        <Route element={<BoardDetails />} path="/board/:boardId" />
                        <Route />
                    </Route>
                </Routes>
            </main>
        </div>
    )

}




