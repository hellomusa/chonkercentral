import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarSeparator,
} from '@/components/ui/sidebar'

import React from 'react'

import { StudySpotsGroup } from './studyspots/StudySpotsGroup'

export async function AppSidebar() {
  return (
    <Sidebar variant="floating">
      <SidebarContent>
        <AppSidebarHeader />
        <StudySpotsGroup />
        <SidebarSeparator />
      </SidebarContent>
    </Sidebar>
  )
}

function AppSidebarHeader() {
  return (
    <SidebarHeader className="border-b border-sidebar-border">
      <h1 className="text-3xl font-bold tracking-tight">
        <span className="text-4xl">C</span>honker{' '}
        <span className="text-4xl">C</span>entral
      </h1>
    </SidebarHeader>
  )
}

interface AppSidebarGroupProps {
  title: string
  children: React.ReactNode
}

export function AppSidebarGroup({ title, children }: AppSidebarGroupProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      {children}
    </SidebarGroup>
  )
}
