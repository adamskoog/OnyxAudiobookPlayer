import React, { useEffect, useState, ReactElement } from 'react';

import { useAppSelector, useAppDispatch } from '../../context/hooks';
import { setServerSetting, setLibrarySetting, setApplicationTheme } from '../../context/actions/settingsActions';

import { ToggleSwitch, Combobox } from '../util/controls';

function Settings(): ReactElement {
  const dispatch = useAppDispatch();

  const serverIdentifier = useAppSelector((state) => state.settings.serverIdentifier);
  const librarySection = useAppSelector((state) => state.settings.librarySection);
  const resources = useAppSelector((state) => state.settings.servers);
  const libraries = useAppSelector((state) => state.settings.libraries);
  const isDarkMode = useAppSelector((state) => state.settings.isDarkMode);

  // Local state for option arrays.
  const [serverOptions, setServerOptions]: [any, any] = useState([]);
  const [libraryOptions, setLibraryOptions]: [any, any] = useState([]);

  useEffect(() => {
    if (resources && resources.length > 0) {
      setServerOptions(resources.map((resource: any) => ({
        displayValue: resource.name, value: resource.clientIdentifier,
      })));
    } else setServerOptions([]);
  }, [resources]);

  useEffect(() => {
    if (libraries && libraries.length > 0) {
      setLibraryOptions(libraries.map((library: any) => ({
        displayValue: library.title, value: library.key,
      })));
    } else setLibraryOptions([]);
  }, [libraries]);

  return (
    <>
      <Combobox value={serverIdentifier} options={serverOptions} callback={(option: any) => dispatch(setServerSetting(option.value))} defaultLabel="Select a Server..." noOptionsLabel="No servers found." />
      <Combobox value={librarySection} options={libraryOptions} callback={(option: any) => dispatch(setLibrarySetting(option.value))} defaultLabel="Select a Library..." noOptionsLabel="No libraries found." />
      <ToggleSwitch label="Dark Mode" srLabel="Enable Dark Mode" value={isDarkMode} callback={() => dispatch(setApplicationTheme(!isDarkMode))} />
    </>
  );
}

export default Settings;
