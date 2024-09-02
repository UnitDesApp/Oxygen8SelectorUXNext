import { useGetSavedUnit } from 'src/hooks/useApi';
import { any } from 'prop-types';
// import Selection from './Selection';

interface SelectionWrapperProps {
  projectId: number;
  unitId: number;
}

export default function SelectionWrapper({ projectId, unitId }: SelectionWrapperProps) {
  const { data: unitData, isLoading: isLoadingUnitInfo } = useGetSavedUnit(
    {
      intUserId: typeof window !== 'undefined' && localStorage.getItem('userId'),
      intUAL: typeof window !== 'undefined' && localStorage.getItem('UAL'),
      // intProjectID: projectId,
      intJobId: projectId,
      intUnitNo: unitId,
    },
    {
      enabled: typeof window !== 'undefined',
    }
  );

 // const { unitInfo  } = unitData || { unitInfo: {} };
const unitInfo: any = unitData || {};

  // return !isLoadingUnitInfo ? (
  //   // <Selection
  //   //   unitTypeData={{
  //   //     intProductTypeID: unitInfo?.productTypeID,
  //   //     intUnitTypeID: unitInfo?.unitTypeID,
  //   //   }}
  //   //   intUnitNo={unitId}
  //   // />

  //   <Selection intJobId={unitInfo?.intProjectID} intUnitNo={unitId} intProdTypeId={unitInfo?.productTypeID}/>
  // ) : null;
}
