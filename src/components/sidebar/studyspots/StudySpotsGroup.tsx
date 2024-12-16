'use client'

import { parseAsBoolean, parseAsString, useQueryState } from 'nuqs'
import { LibrarySpotsMenu } from './library/LibrarySpotsMenu'
import { OtherSpotsMenu } from './other/OtherSpotsMenu'
import { AppSidebarGroup } from '../app-sidebar'

function useShowAvailable() {
	return useQueryState('showAvailable', parseAsBoolean.withDefault(false))
}

export function StudySpotsGroup() {
	const [openMenu, setOpenMenu] = useQueryState(
		'studySpots',
		parseAsString
	)
	const [showAvailable, setShowAvailable] = useShowAvailable();

	const toggleLibraryMenu = () => {
		setOpenMenu((openMenu) => {
			if (openMenu != "library") return "library";
			if (showAvailable) setShowAvailable(false);
			return null
		})
	}
	
	const toggleOtherMenu = () =>
		setOpenMenu((openMenu) => (openMenu !== 'other' ? 'other' : null))

	return (
		<AppSidebarGroup title="Study spaces">
			<LibrarySpotsMenu
				open={openMenu === 'library'}
				onOpenChange={toggleLibraryMenu}
			/>
			<OtherSpotsMenu
				open={openMenu === 'other'}
				onOpenChange={toggleOtherMenu}
			/>
		</AppSidebarGroup>
	)
}
