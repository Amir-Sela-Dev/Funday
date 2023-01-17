import React from 'react'
import { Routes, Route } from 'react-router'

import routes from './routes'

import { UserDetails } from './pages/user-details'
import { AppIndex } from './pages/app-index'
import { BoardDetails } from './cmps/board-details'

export function RootCmp() {

    return (
        <div>
            {/* <AppHeader /> */}
            <main>
                <Routes>
                    {routes.map(route => <Route key={route.path} exact={true} element={route.component} path={route.path} />)}
                    <Route path="user/:id" element={<UserDetails />} />
                    <Route path="/board" element={<AppIndex />} >
                        <Route element={<BoardDetails />} path="/board/:boardId" />
                    </Route>
                </Routes>
            </main>
            {/* <AppFooter /> */}
        </div>
    )
}


