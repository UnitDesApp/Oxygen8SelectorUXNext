const ClsID = require('src/utils/ids');

export const getUnitModelCodes = (
  strUnitModelCodes: string,
  _intUnitProdId: number,
  _intUnitTypeId: number,
  _intLocId: number,
  _intOriId: number,
  _intIsBypass: number,
  data: any
) => {
  const strUnitModelFullValue = strUnitModelCodes;
  const strUnitModelValue = strUnitModelCodes
    ?.replace('_HOR', '')
    ?.replace('_VER', '')
    ?.replace('_IN', '')
    ?.replace('_OU', '')
    ?.replace('_ERV', '')
    ?.replace('_HRV', '')
    ?.replace('_AHU', '')
    ?.replace('_BP', '');
  let strUnitModelOriValue = strUnitModelCodes
    ?.replace('_IN', '')
    ?.replace('_OU', '')
    ?.replace('_ERV', '')
    ?.replace('_HRV', '')
    ?.replace('_AHU', '')
    ?.replace('_BP', '');
  let strUnitModelLocValue = strUnitModelCodes
    ?.replace('_HOR', '')
    ?.replace('_VER', '')
    ?.replace('_ERV', '')
    ?.replace('_HRV', '')
    ?.replace('_BP', '');
  let strUnitModelUnitTypeValue = strUnitModelCodes
    ?.replace('_HOR', '')
    ?.replace('_VER', '')
    ?.replace('_IN', '')
    ?.replace('_OU', '')
    ?.replace('_BP', '');
  const strUnitModelBypassValue = strUnitModelCodes
    ?.replace('_HOR', '')
    ?.replace('_VER', '')
    ?.replace('_IN', '')
    ?.replace('_OU', '')
    ?.replace('_ERV', '')
    ?.replace('_HRV', '');
  let strUnitModelOriLocValue = strUnitModelCodes
    ?.replace('_ERV', '')
    ?.replace('_HRV', '')
    ?.replace('_AHU', '')
    ?.replace('_BP', '');
  let strUnitModelOriBypassValue = strUnitModelCodes
    ?.replace('_IN', '')
    ?.replace('_OU', '')
    ?.replace('_ERV', '')
    ?.replace('_HRV', '');
  let strUnitModelLocBypassValue = strUnitModelCodes
    ?.replace('_HOR', '')
    ?.replace('_VER', '')
    ?.replace('_ERV', '')
    ?.replace('_HRV', '');
  const strUnitModelUnitTypeBypassValue = strUnitModelCodes
    ?.replace('_HOR', '')
    ?.replace('_VER', '')
    ?.replace('_IN', '')
    ?.replace('_OU', '');
  let strUnitModelLocUnitTypeBypassValue = strUnitModelCodes
    ?.replace('_HOR', '')
    ?.replace('_VER', '');
  let strUnitModelOriLocUnitTypeBypassValue = strUnitModelCodes;
  let strUnitModelValueNovaBypass = '';
  let strUnitModelValueNovaBypassAccCoupled = '';
  let strUnitModelValueNovaBypassAccElecCoil = '';
  let strUnitModelValueNovaBypassAccDecoupled = '';

  switch (_intUnitTypeId) {
    case ClsID.intUnitTypeIdERV:
      strUnitModelUnitTypeValue = strUnitModelUnitTypeValue?.replace('_HRV', '');
      strUnitModelLocUnitTypeBypassValue = strUnitModelLocUnitTypeBypassValue?.replace('_HRV', '');
      strUnitModelOriLocUnitTypeBypassValue = strUnitModelOriLocUnitTypeBypassValue?.replace('_HRV', '');
      break;
    case ClsID.intUnitTypeIdHRV:
      strUnitModelUnitTypeValue = strUnitModelUnitTypeValue?.replace('_ERV', '');
      strUnitModelLocUnitTypeBypassValue = strUnitModelLocUnitTypeBypassValue?.replace('_ERV', '');
      strUnitModelOriLocUnitTypeBypassValue = strUnitModelOriLocUnitTypeBypassValue?.replace('_ERV', '');
      break;
    default:
      break;
  }

  switch (_intLocId) {
    case ClsID.intLocationIdIndoor:
      strUnitModelLocValue = strUnitModelLocValue?.replace('_OU', '');
      strUnitModelOriLocValue = strUnitModelOriLocValue?.replace('_OU', '');
      strUnitModelLocBypassValue = strUnitModelLocBypassValue?.replace('_OU', '');
      strUnitModelLocUnitTypeBypassValue = strUnitModelLocUnitTypeBypassValue?.replace('_OU', '');
      strUnitModelOriLocUnitTypeBypassValue = strUnitModelOriLocUnitTypeBypassValue?.replace('_OU', '');
      break;
    case ClsID.intLocationIdOutdoor:
      strUnitModelLocValue = strUnitModelLocValue?.replace('_IN', '');
      strUnitModelOriLocValue = strUnitModelOriLocValue?.replace('_IN', '');
      strUnitModelLocBypassValue = strUnitModelLocBypassValue?.replace('_IN', '');
      strUnitModelLocUnitTypeBypassValue = strUnitModelLocUnitTypeBypassValue?.replace('_IN', '');
      strUnitModelOriLocUnitTypeBypassValue = strUnitModelOriLocUnitTypeBypassValue?.replace('_IN', '');
      break;
    default:
      break;
  }

  switch (_intOriId) {
    case ClsID.intOrientationIdHorizontal:
      strUnitModelOriValue = strUnitModelOriValue?.replace('_VER', '');
      strUnitModelOriBypassValue = strUnitModelOriBypassValue?.replace('_VER', '');
      strUnitModelOriLocValue = strUnitModelOriLocValue?.replace('_VER', '');
      strUnitModelOriLocUnitTypeBypassValue = strUnitModelOriLocUnitTypeBypassValue?.replace('_VER', '');
      break;
    case ClsID.intOrientationIdVertical:
      strUnitModelOriValue = strUnitModelOriValue?.replace('_HOR', '');
      strUnitModelOriBypassValue = strUnitModelOriBypassValue?.replace('_VER', '');
      strUnitModelOriLocValue = strUnitModelOriLocValue?.replace('_HOR', '');
      strUnitModelOriLocUnitTypeBypassValue = strUnitModelOriLocUnitTypeBypassValue?.replace('_HOR', '');
      break;
    default:
      break;
  }

  if (_intIsBypass === 0) {
    strUnitModelLocBypassValue = strUnitModelLocBypassValue?.replace('_BP', '');
    strUnitModelOriBypassValue = strUnitModelOriBypassValue?.replace('_BP', '');
    strUnitModelLocUnitTypeBypassValue = strUnitModelLocUnitTypeBypassValue?.replace('_BP', '');
    strUnitModelOriLocUnitTypeBypassValue = strUnitModelOriLocUnitTypeBypassValue?.replace('_BP', '');
  }

  if (_intUnitProdId === ClsID.intProdTypeIdNova && _intIsBypass === 1) {
    const dtModelBypassAccs = data.novaUnitModelBypass?.filter(
      (item: any) => item.unit_model_value === strUnitModelLocValue
    );

    if (dtModelBypassAccs && dtModelBypassAccs?.length > 0) {
      strUnitModelValueNovaBypass = dtModelBypassAccs[0]?.model_bypass_dwg_code.ToString();
      strUnitModelValueNovaBypassAccCoupled = dtModelBypassAccs[0]?.coupled_dwg_code.ToString();
      strUnitModelValueNovaBypassAccElecCoil = dtModelBypassAccs[0]?.electric_coil_dwg_code.ToString();
      strUnitModelValueNovaBypassAccDecoupled = dtModelBypassAccs[0]?.decoupled_dwg_code.ToString();
    }
  }

  return {
    strUnitModelFullValue,
    strUnitModelValue,
    strUnitModelOriValue,
    strUnitModelLocValue,
    strUnitModelUnitTypeValue,
    strUnitModelBypassValue,
    strUnitModelOriLocValue,
    strUnitModelOriBypassValue,
    strUnitModelLocBypassValue,
    strUnitModelUnitTypeBypassValue,
    strUnitModelLocUnitTypeBypassValue,
    strUnitModelOriLocUnitTypeBypassValue,
    strUnitModelValueNovaBypass,
    strUnitModelValueNovaBypassAccCoupled,
    strUnitModelValueNovaBypassAccElecCoil,
    strUnitModelValueNovaBypassAccDecoupled,
  };
};

export default function Index() {
  return null;
}
