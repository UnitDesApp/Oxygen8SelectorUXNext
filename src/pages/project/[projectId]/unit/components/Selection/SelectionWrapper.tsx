import { useGetUnitInfo } from 'src/hooks/useApi';
import Selection from './Selection';

interface SelectionWrapperProps {
  projectId: number;
  unitId: number;
}

export default function SelectionWrapper({ projectId, unitId }: SelectionWrapperProps) {
  const { data: unitData, isLoading: isLoadingUnitInfo } = useGetUnitInfo(
    {
      intUserID: typeof window !== 'undefined' && localStorage.getItem('userId'),
      intUAL: typeof window !== 'undefined' && localStorage.getItem('UAL'),
      intProjectID: projectId,
      intUnitNo: unitId,
    },
    {
      enabled: typeof window !== 'undefined',
    }
  );

  const { unitInfo } = unitData || { unitInfo: {} };

  return !isLoadingUnitInfo ? (
    <Selection
      unitTypeData={{
        intProductTypeID: unitInfo?.productTypeID,
        intUnitTypeID: unitInfo?.unitTypeID,
      }}
      intUnitNo={unitId}
    />
  ) : null;
}
