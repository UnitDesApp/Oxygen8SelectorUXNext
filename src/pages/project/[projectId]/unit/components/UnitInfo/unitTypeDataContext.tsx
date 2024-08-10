import React, { createContext, useState, ReactNode } from 'react';


type UnitTypeData = {
  intProductTypeID: number;
  txbProductType: string;
  intApplicationTypeID: number;
  txbApplicationType: string;
  intUnitTypeID: number;
  txbUnitType: string;
}

const DEFAULT_UNIT_DATA: UnitTypeData = {
  intProductTypeID: -1,
  txbProductType: '',
  intUnitTypeID: -1,
  txbUnitType: '',
  intApplicationTypeID: -1,
  txbApplicationType: '',
};

type UnitTypeContextType = {
  unitTypeData: UnitTypeData;
  setUnitTypeData: React.Dispatch<React.SetStateAction<UnitTypeData>>;
}

export const UnitTypeContext = createContext<UnitTypeContextType>({
  unitTypeData: DEFAULT_UNIT_DATA,
  setUnitTypeData: () => {},
});

export const UnitTypeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [unitTypeData, setUnitTypeData] = useState<UnitTypeData>(DEFAULT_UNIT_DATA);

  return (
    <UnitTypeContext.Provider value={{ unitTypeData, setUnitTypeData }}>
      {children}
    </UnitTypeContext.Provider>
  );
};
