import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout.jsx';
import { Home } from '../pages/Home.jsx';
import { GamifiedTodoList } from '../components/GamifiedTodoList.jsx';
import { CharacterSheet } from '../components/CharacterSheet.jsx';
import { StreakTrail } from '../components/StreakTrail.jsx';
import { Login } from '../pages/Login.jsx';
import { Register } from '../pages/Register.jsx';
import { NotFound } from '../pages/NotFound.jsx';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/quests" element={<GamifiedTodoList />} />
        <Route path="/character" element={<CharacterSheet />} />
        <Route path="/stats" element={<CharacterSheet />} />
        <Route path="/streak" element={<StreakTrail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};
