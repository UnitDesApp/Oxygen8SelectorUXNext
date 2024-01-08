import { useState } from 'react';

export default function useTabs(defaultValues?: string) {
  const [currentTab, setCurrentTab] = useState<string>(defaultValues || '');

  return {
    currentTab,
    onChangeTab: (event: any, newValue: string) => {
      setCurrentTab(newValue);
    },
    setCurrentTab,
  };
}
