import * as ClsID from 'src/utils/ids';

// const ClsID = require('src/utils/ids');

const intNOVA_MIN_CFM = 325;
const intNOVA_MAX_CFM = 9000;

const intNOVA_INT_USERS_MIN_CFM = 325;
const intNOVA_INT_USERS_MAX_CFM = 8100;
const intNOVA_HORIZONTAL_MAX_CFM = 3500;

const intVEN_MIN_CFM_NO_BYPASS = 325;
const intVEN_MAX_CFM_NO_BYPASS = 3000;
const intVEN_MIN_CFM_WITH_BYPASS = 325;
const intVEN_MAX_CFM_WITH_BYPASS = 3000;

const intVEN_INT_USERS_MIN_CFM_NO_BYPASS = 300;
const intVEN_INT_USERS_MAX_CFM_NO_BYPASS = 3048;
const intVEN_INT_USERS_MIN_CFM_WITH_BYPASS = 300;
const intVEN_INT_USERS_MAX_CFM_WITH_BYPASS = 3048;

const intVEN_MIN_CFM_PHI = 185;
const intVEN_MAX_CFM_PHI = 1480;

const intVENLITE_MIN_CFM_NO_BYPASS = 200;
const intVENLITE_MAX_CFM_NO_BYPASS = 500;
const intVENLITE_MIN_CFM_WITH_BYPASS = 200;
const intVENLITE_MAX_CFM_WITH_BYPASS = 500;

const intVENLITE_INT_USERS_MIN_CFM_NO_BYPASS = 170;
const intVENLITE_INT_USERS_MAX_CFM_NO_BYPASS = 500;
const intVENLITE_INT_USERS_MIN_CFM_WITH_BYPASS = 170;
const intVENLITE_INT_USERS_MAX_CFM_WITH_BYPASS = 500;

const intVENPLUS_MIN_CFM_NO_BYPASS = 1200;
const intVENPLUS_MAX_CFM_NO_BYPASS = 10000;
const intVENPLUS_MIN_CFM_WITH_BYPASS = 1200;
const intVENPLUS_MAX_CFM_WITH_BYPASS = 10000;

const intVENPLUS_INT_USERS_MIN_CFM_NO_BYPASS = 1080;
const intVENPLUS_INT_USERS_MAX_CFM_NO_BYPASS = 10500;
const intVENPLUS_INT_USERS_MIN_CFM_WITH_BYPASS = 1080;
const intVENPLUS_INT_USERS_MAX_CFM_WITH_BYPASS = 10500;

const intVENPLUS_MIN_CFM_PHI = 495;
const intVENPLUS_MAX_CFM_PHI = 7150;

const intTERA_MIN_CFM_NO_BYPASS = 450;
const intTERA_MAX_CFM_NO_BYPASS = 4800;
const intTERA_MIN_CFM_WITH_BYPASS = 450;
const intTERA_MAX_CFM_WITH_BYPASS = 4800;

const intTERA_INT_USERS_MIN_CFM_NO_BYPASS = 450;
const intTERA_INT_USERS_MAX_CFM_NO_BYPASS = 4800;
const intTERA_INT_USERS_MIN_CFM_WITH_BYPASS = 450;
const intTERA_INT_USERS_MAX_CFM_WITH_BYPASS = 4800;

// const getFromLink = (dt: any, linkColumn: any, dtLink: any, sortColumn: string) => {
//   if (!dt || !dtLink) return [];
//   let intID = 0;
//   let intLinkID = 0;

//   // const dtSelected = new Array<{ [key: string]: any }>([]);
//   const dtSelected = new Array<{ [key: string]: any }>();

//   for (let i = 0; i < dt?.length; i += 1) {
//     intID = Number(dt[i].id);
//     for (let j = 0; j < dtLink?.length; j += 1) {
//       intLinkID = Number(dtLink[j][linkColumn]);

//       if (intID === intLinkID) {
//         const dr: { [key: string]: any } = {};
//         dr.id = Number(dt[i].id);
//         dr.items = dt[i].items.toString();

//         if (sortColumn !== '') {
//           dr[sortColumn] = Number(dt[i][sortColumn]);
//         }

//         dr.bypass_exist = dt[i]?.bypass_exist?.toString();
//         dr.bypass_exist_horizontal_unit = dt[i]?.bypass_exist_horizontal_unit?.toString();
//         dr.model_bypass = dt[i]?.model_bypass?.toString();

//         dtSelected.push(dr);
//         break;
//       }

//       if (intLinkID > intID) {
//         break;
//       }
//     }
//   }

//   return dtSelected;
// };

// // const sortColume = (data: any, colume: string) =>
// //   data?.sort((a: any, b: any) => a[colume] - b[colume]);

const unitModelFilter = (data: any, value: any, minColumeName: string, maxColumeName: string) =>
  data?.filter((item: any) => item[minColumeName] <= value && value <= item[maxColumeName])
    .sort((a: any, b: any) => a.cfm_max - b.cfm_max);

export const getUnitModel = (
  db: {
    dbtSelNovaUnitModelLocOriLink: any;
    dbtSelGeneralLocation: any[];
    dbtSelGeneralOrientation: any[];
    dbtSelNovaUnitModel: any[];
    dbtSelVentumHUnitModel: {
      filter: (arg0: {
        (item: any): boolean;
        (item: any): boolean;
        (item: any): boolean;
      }) => never[];
    };
    dbtSelVentumLiteUnitModel: {
      filter: (arg0: {
        (item: any): boolean;
        (item: any): boolean;
        (item: any): boolean;
        (item: any): boolean;
        (item: any): boolean;
      }) => never[];
    };
    dbtSelVentumPlusUnitModel: any;
    dbtSelTerraUnitModel: { filter: (arg0: { (item: any): boolean; (item: any): boolean }) => never[] };
  },
  intUnitTypeID: any,
  intProductTypeID: any,
  unitModelId: number,
  locationId: number,
  orientationId: number,
  summerSupplyAirCFM: number,
  ckbBypassVal: number,
  intUAL: any
) => {
  let unitModel: any = [];
  if (locationId > -1 && orientationId > -1) {
    let unitModelLink: any = [];
    let location: {
      value: any;
      id_key: any;
    }[];
    let orientation: { value: { toString: () => any } }[];
    unitModelId = Number.isNaN(unitModelId) ? 0 : unitModelId;

    switch (intProductTypeID) {
      case ClsID.intProdTypeIdNova:
        unitModelLink = db?.dbtSelNovaUnitModelLocOriLink;
        location = db?.dbtSelGeneralLocation?.filter((item: { id: any }) => item.id === locationId);
        orientation = db?.dbtSelGeneralOrientation?.filter(
          (item: { id: any }) => item.id === orientationId
        );

        unitModelLink = unitModelLink?.filter(
          (item: { location_value: any; orientation_value: any }) =>
            item.location_value === location?.[0]?.value.toString() &&
            item.orientation_value === orientation?.[0]?.value.toString()
        );

        if (intUAL === ClsID.intUAL_External || intUAL === ClsID.intUAL_ExternalSpecial) {
          // unitModel = unitModelFilter(data?.novaUnitModel, summerSupplyAirCFM, 'cfm_min_ext_users', 'cfm_max_ext_users', unitModelId);
          // unitModel = data?.novaUnitModel?.filter((item) => item.terra_spp === 1);
          // unitModel = data?.novaUnitModel?.filter((item) => (item['cfm_min_ext_users'] >= summerSupplyAirCFM && summerSupplyAirCFM <= item['cfm_max_ext_users']) ).sort((a, b) => a.cfm_max - b.cfm_max);
          unitModel =
          db?.dbtSelNovaUnitModel?.filter(
              (item: { cfm_min_ext_users: number; cfm_max_ext_users: number }) =>
                item.cfm_min_ext_users <= summerSupplyAirCFM &&
                item.cfm_max_ext_users >= summerSupplyAirCFM
            ) || [];
        } else {
          // unitModel = unitModelFilter(data?.novaUnitModel, summerSupplyAirCFM, 'cfm_min', 'cfm_max', unitModelId);
          unitModel = db?.dbtSelNovaUnitModel?.filter(
            (item: { cfm_min: number; cfm_max: number }) =>
              item.cfm_min <= summerSupplyAirCFM && item.cfm_max >= summerSupplyAirCFM
          );
        }

        if (intUAL === ClsID.intUAL_External || intUAL === ClsID.intUAL_ExternalSpecial) {
          unitModel = unitModel?.filter(
            (item: { enabled_ext_users: number }) => item.enabled_ext_users === 1
          );
        }

        // unitModel = getFromLink(unitModel, 'unit_model_id', unitModelLink, 'cfm_max');

        unitModel = unitModel?.filter((e: { id: any}) => unitModelLink?.filter((e_link: { unit_model_id: any}) => e.id === e_link.unit_model_id)?.length > 0);
        unitModel?.sort((a: any, b: any) => a.cfm_max- b.cfm_max);


        // unitModel = sortColume(unitModel, 'cfm_max');


        if (ckbBypassVal === 1) {
          const drUnitModelBypass = unitModel?.filter(
            (item: { bypass_exist: number }) => item.bypass_exist === 1
          );
          const unitModelBypass = drUnitModelBypass || [];

          if (unitModelBypass?.length > 0) {
            unitModel = unitModel?.filter((item: { bypass_exist: number }) => item.bypass_exist === 1
            );

            if (orientationId === ClsID.intOrientationIdHorizontal) {
              const drUnitModelBypassHorUnit = unitModel?.filter(
                (item: { bypass_exist_horizontal_unit: number }) => item.bypass_exist_horizontal_unit === 1
              );
              const unitModelBypassHorUnit = drUnitModelBypassHorUnit || [];

              if (unitModelBypassHorUnit?.length > 0) {
                unitModel = unitModel?.filter(
                  (item: { bypass_exist_horizontal_unit: number }) => item.bypass_exist_horizontal_unit === 1
                );
              } else {
                ckbBypassVal = 0;
              }
            }
          }
        }
        break;
      case ClsID.intProdTypeIdVentum:
        if (ckbBypassVal === 1) {
          summerSupplyAirCFM = summerSupplyAirCFM > intVEN_MAX_CFM_WITH_BYPASS ? intVEN_MAX_CFM_WITH_BYPASS : summerSupplyAirCFM;
        }

        if (intUAL === ClsID.intUAL_External || intUAL === ClsID.intUAL_ExternalSpecial) {
          if (intUnitTypeID === ClsID.intUnitTypeIdERV) {
            // unitModel = unitModelFilter(data?.ventumHUnitModel,summerSupplyAirCFM,'erv_cfm_min_ext_users','erv_cfm_max_ext_users',unitModelId);
            unitModel =
            db?.dbtSelVentumHUnitModel?.filter(
                (item: { erv_cfm_min_ext_users: number; erv_cfm_max_ext_users: number }) =>
                  item.erv_cfm_min_ext_users <= summerSupplyAirCFM &&
                  item.erv_cfm_max_ext_users >= summerSupplyAirCFM
              ) || [];

            unitModel = unitModel.map((item: { model_erv: any }) => ({
              ...item,
              items: item.model_erv,
            }));
          } else if (intUnitTypeID === ClsID.intUnitTypeIdHRV) {
            // unitModel = unitModelFilter(data?.ventumHUnitModel,summerSupplyAirCFM,'hrv_cfm_min_ext_users','hrv_cfm_max_ext_users', unitModelId);
            unitModel =
            db?.dbtSelVentumHUnitModel?.filter(
                (item: { hrv_cfm_min_ext_users: number; hrv_cfm_max_ext_users: number }) =>
                  item.hrv_cfm_min_ext_users <= summerSupplyAirCFM &&
                  item.hrv_cfm_max_ext_users >= summerSupplyAirCFM
              ) || [];

            unitModel = unitModel.map((item: { model_hrv: any }) => ({
              ...item,
              items: item.model_hrv,
            }));
          }
        } else {
          // unitModel = unitModelFilter(data?.ventumHUnitModel, summerSupplyAirCFM, 'cfm_min', 'cfm_max', unitModelId);
          unitModel =
          db?.dbtSelVentumHUnitModel?.filter(
              (item: { cfm_min: number; cfm_max: number }) =>
                item.cfm_min <= summerSupplyAirCFM && item.cfm_max >= summerSupplyAirCFM
            ) || [];
        }

        unitModel = unitModel?.filter((item: { bypass: any }) => item.bypass === ckbBypassVal);

        // getReheatInfo();    //Only for Ventum - H05 has no HGRH option
        break;
      case ClsID.intProdTypeIdVentumLite:
        ckbBypassVal = 0;

        if (intUAL === ClsID.intUAL_IntLvl_1 || intUAL === ClsID.intUAL_IntLvl_2) {
          if (intUnitTypeID === ClsID.intUnitTypeIdERV) {
            // unitModel = unitModelFilter(data?.ventumLiteUnitModel,summerSupplyAirCFM,'cfm_min','cfm_max', unitModelId);
            unitModel = db?.dbtSelVentumLiteUnitModel?.filter((item: { cfm_min: number; cfm_max: number }) => item.cfm_min <= summerSupplyAirCFM && item.cfm_max >= summerSupplyAirCFM ) || [];

            unitModel = unitModel.map((item: { model_erv: any }) => ({
              ...item,
              items: item.model_erv,
            }));
          } else if (intUnitTypeID === ClsID.intUnitTypeIdHRV) {
            // unitModel = unitModelFilter(data?.ventumLiteUnitModel,summerSupplyAirCFM,'cfm_min','cfm_max',unitModelId);
            unitModel =
            db?.dbtSelVentumLiteUnitModel?.filter(
                (item: { cfm_min: number; cfm_max: number }) =>
                  item.cfm_min <= summerSupplyAirCFM && item.cfm_max >= summerSupplyAirCFM
              ) || [];

            unitModel = unitModel.map((item: { model_hrv: any }) => ({
              ...item,
              items: item.model_hrv,
            }));
          }
        } else if (intUAL === ClsID.intUAL_External || intUAL === ClsID.intUAL_ExternalSpecial) {
          if (intUnitTypeID === ClsID.intUnitTypeIdERV) {
            // unitModel = unitModelFilter(data?.ventumLiteUnitModel,summerSupplyAirCFM,'erv_cfm_min_ext_users','erv_cfm_max_ext_users',unitModelId);
            unitModel =
            db?.dbtSelVentumLiteUnitModel?.filter(
                (item: { erv_cfm_min_ext_users: number; erv_cfm_max_ext_users: number }) =>
                  item.erv_cfm_min_ext_users <= summerSupplyAirCFM &&
                  item.erv_cfm_max_ext_users >= summerSupplyAirCFM
              ) || [];
            unitModel = unitModel.map((item: { model_erv: any }) => ({
              ...item,
              items: item.model_erv,
            }));
          } else if (intUnitTypeID === ClsID.intUnitTypeIdHRV) {
            // unitModel = unitModelFilter(data?.ventumLiteUnitModel, summerSupplyAirCFM,'hrv_cfm_min_ext_users','hrv_cfm_max_ext_users',unitModelId);
            unitModel =
            db?.dbtSelVentumLiteUnitModel?.filter(
                (item: { hrv_cfm_min_ext_users: number; hrv_cfm_max_ext_users: number }) =>
                  item.hrv_cfm_min_ext_users <= summerSupplyAirCFM &&
                  item.hrv_cfm_max_ext_users >= summerSupplyAirCFM
              ) || [];
            unitModel = unitModel.map((item: { model_hrv: any }) => ({
              ...item,
              items: item.model_hrv,
            }));
          }

          const drUnitModel = unitModel?.filter(
            (item: { enabled_ext_users: number }) => item.enabled_ext_users === 1
          );
          unitModel = drUnitModel || [];
        } else {
          // unitModel = unitModelFilter(data?.ventumLiteUnitModel, summerSupplyAirCFM, 'cfm_min', 'cfm_max', unitModelId);
          unitModel =
          db?.dbtSelVentumLiteUnitModel?.filter(
              (item: { cfm_min: number; cfm_max: number }) =>
                item.cfm_min <= summerSupplyAirCFM && item.cfm_max >= summerSupplyAirCFM
            ) || [];
        }

        unitModel = unitModel?.filter(
          (item: { enabled: number; bypass: any }) =>
            item.enabled === 1 && item.bypass === ckbBypassVal
        );
        break;
      case ClsID.intProdTypeIdVentumPlus:
        if (ckbBypassVal === 1) {
          summerSupplyAirCFM =
            summerSupplyAirCFM > intVENPLUS_MAX_CFM_WITH_BYPASS
              ? intVENPLUS_MAX_CFM_WITH_BYPASS
              : summerSupplyAirCFM;
        }
        if (summerSupplyAirCFM < 1200) {
          summerSupplyAirCFM = 1200;
        }

        if (intUAL === ClsID.intUAL_External || intUAL === ClsID.intUAL_ExternalSpecial) {
          if (intUnitTypeID === ClsID.intUnitTypeIdERV) {
            unitModel = unitModelFilter(
              db?.dbtSelVentumPlusUnitModel,
              summerSupplyAirCFM,
              'erv_cfm_min_ext_users',
              'erv_cfm_max_ext_users'
            );
            unitModel = unitModel.map((item: { model_erv: any }) => ({
              ...item,
              items: item.model_erv,
            }));
          } else if (intUnitTypeID === ClsID.intUnitTypeIdHRV) {
            unitModel = unitModelFilter(
              db?.dbtSelVentumPlusUnitModel,
              summerSupplyAirCFM,
              'hrv_cfm_min_ext_users',
              'hrv_cfm_max_ext_users'
            );
            unitModel = unitModel.map((item: { model_hrv: any }) => ({
              ...item,
              items: item.model_hrv,
            }));
          }
        } else {
          unitModel = unitModelFilter(
            db?.dbtSelVentumPlusUnitModel,
            summerSupplyAirCFM,
            'cfm_min',
            'cfm_max'
          );
          unitModel = unitModel.map((item: { items: any; cfm_min: any; cfm_max: any }) => ({
            ...item,
            items: `${item.items} - (${item.cfm_min}-${item.cfm_max} CFM)`,
          }));
        }
        location = db?.dbtSelGeneralLocation?.filter((item: { id: any }) => item.id === locationId);
        unitModel = unitModel?.filter(
          (item: { location_id_key: any; enabled: number; bypass: any }) =>
            item.location_id_key === location?.[0]?.id_key &&
            item.enabled === 1 &&
            item.bypass === ckbBypassVal
        );
        break;
      case ClsID.intProdTypeIdTerra:
        if (intUAL === ClsID.intUAL_External || intUAL === ClsID.intUAL_ExternalSpecial) {
          // unitModel = unitModelFilter(data?.terraUnitModel,summerSupplyAirCFM,'cfm_min_ext_users','cfm_max_ext_users',unitModelId);
          unitModel =
          db?.dbtSelTerraUnitModel?.filter(
              (item: { cfm_min_ext_users: number; cfm_max_ext_users: number }) =>
                item.cfm_min_ext_users <= summerSupplyAirCFM &&
                item.cfm_max_ext_users >= summerSupplyAirCFM
            ) || [];

          const drUnitModel = unitModel?.filter(
            (item: { enabled_ext_users: number }) => item.enabled_ext_users === 1
          );
          unitModel = drUnitModel || [];
        } else {
          // unitModel = unitModelFilter(data?.terraUnitModel, summerSupplyAirCFM, 'cfm_min', 'cfm_max', unitModelId);
          unitModel =
          db?.dbtSelTerraUnitModel?.filter(
              (item: { cfm_min: number; cfm_max: number }) =>
                item.cfm_min <= summerSupplyAirCFM && item.cfm_max >= summerSupplyAirCFM
            ) || [];
        }

        break;
      default:
        break;
    }
  }

  return { unitModelList: unitModel, summerSupplyAirCFM };
};

export const getSummerSupplyAirCFM = (
  summerSupplyAirCFM: any,
  intProductTypeID: any,
  intUAL: any,
  ckbBypassVal: number,
  ckbPHI: number
) => {
  let intSummerSupplyAirCFM = Number(summerSupplyAirCFM);
  switch (intProductTypeID) {
    case ClsID.intProdTypeIdNova:
      if (intUAL === ClsID.intUAL_Admin || intUAL === ClsID.intUAL_IntAdmin ||
          intUAL === ClsID.intUAL_IntLvl_2 || intUAL === ClsID.intUAL_IntLvl_1
      ) {
        if (intSummerSupplyAirCFM < intNOVA_MIN_CFM) {
          intSummerSupplyAirCFM = intNOVA_MIN_CFM;
        } else if (intSummerSupplyAirCFM > intNOVA_MAX_CFM) {
          intSummerSupplyAirCFM = intNOVA_MAX_CFM;
        }
      } else if (intSummerSupplyAirCFM < intNOVA_INT_USERS_MIN_CFM) {
        intSummerSupplyAirCFM = intNOVA_INT_USERS_MIN_CFM;
      } else if (intSummerSupplyAirCFM > intNOVA_INT_USERS_MAX_CFM) {
        intSummerSupplyAirCFM = intNOVA_INT_USERS_MAX_CFM;
      }
      break;
    case ClsID.intProdTypeIdVentum:
      if (intUAL === ClsID.intUAL_Admin || intUAL === ClsID.intUAL_IntAdmin ||
          intUAL === ClsID.intUAL_IntLvl_2 || intUAL === ClsID.intUAL_IntLvl_1
      ) {
        if (ckbPHI === 1) {
          if (intSummerSupplyAirCFM < intVEN_MIN_CFM_PHI) {
            intSummerSupplyAirCFM = intVEN_MIN_CFM_PHI;
          } else if (intSummerSupplyAirCFM > intVEN_MAX_CFM_PHI) {
            intSummerSupplyAirCFM = intVEN_MAX_CFM_PHI;
          }
        } else if (ckbBypassVal === 1) {
          if (intSummerSupplyAirCFM < intVEN_INT_USERS_MIN_CFM_WITH_BYPASS) {
            intSummerSupplyAirCFM = intVEN_INT_USERS_MIN_CFM_WITH_BYPASS;
          } else if (intSummerSupplyAirCFM > intVEN_INT_USERS_MAX_CFM_WITH_BYPASS) {
            intSummerSupplyAirCFM = intVEN_INT_USERS_MAX_CFM_WITH_BYPASS;
          }
        } else if (intSummerSupplyAirCFM < intVEN_INT_USERS_MIN_CFM_NO_BYPASS) {
          intSummerSupplyAirCFM = intVEN_INT_USERS_MIN_CFM_NO_BYPASS;
        } else if (intSummerSupplyAirCFM > intVEN_INT_USERS_MAX_CFM_NO_BYPASS) {
          intSummerSupplyAirCFM = intVEN_INT_USERS_MAX_CFM_NO_BYPASS;
        }
      } else if (ckbBypassVal === 1) {
        if (intSummerSupplyAirCFM < intVEN_MIN_CFM_WITH_BYPASS) {
          intSummerSupplyAirCFM = intVEN_MIN_CFM_WITH_BYPASS;
        } else if (intSummerSupplyAirCFM > intVEN_MAX_CFM_WITH_BYPASS) {
          intSummerSupplyAirCFM = intVEN_MAX_CFM_WITH_BYPASS;
        }
      } else if (intSummerSupplyAirCFM < intVEN_MIN_CFM_NO_BYPASS) {
        intSummerSupplyAirCFM = intVEN_MIN_CFM_NO_BYPASS;
      } else if (intSummerSupplyAirCFM > intVEN_MAX_CFM_NO_BYPASS) {
        intSummerSupplyAirCFM = intVEN_MAX_CFM_NO_BYPASS;
      }
      break;
    case ClsID.intProdTypeIdVentumLite:
      if (intUAL === ClsID.intUAL_Admin || intUAL === ClsID.intUAL_IntAdmin ||
          intUAL === ClsID.intUAL_IntLvl_2 || intUAL === ClsID.intUAL_IntLvl_1
      ) {
        if (ckbBypassVal === 1) {
          if (intSummerSupplyAirCFM < intVENLITE_INT_USERS_MIN_CFM_WITH_BYPASS) {
            intSummerSupplyAirCFM = intVENLITE_INT_USERS_MIN_CFM_WITH_BYPASS;
          } else if (intSummerSupplyAirCFM > intVENLITE_INT_USERS_MAX_CFM_WITH_BYPASS) {
            intSummerSupplyAirCFM = intVENLITE_INT_USERS_MAX_CFM_WITH_BYPASS;
          }
        } else if (intSummerSupplyAirCFM < intVENLITE_INT_USERS_MIN_CFM_NO_BYPASS) {
          intSummerSupplyAirCFM = intVENLITE_INT_USERS_MIN_CFM_NO_BYPASS;
        } else if (intSummerSupplyAirCFM > intVENLITE_INT_USERS_MAX_CFM_NO_BYPASS) {
          intSummerSupplyAirCFM = intVENLITE_INT_USERS_MAX_CFM_NO_BYPASS;
        }
      } else if (ckbBypassVal === 1) {
        if (intSummerSupplyAirCFM < intVENLITE_MIN_CFM_WITH_BYPASS) {
          intSummerSupplyAirCFM = intVENLITE_MIN_CFM_WITH_BYPASS;
        } else if (intSummerSupplyAirCFM > intVENLITE_MAX_CFM_WITH_BYPASS) {
          intSummerSupplyAirCFM = intVENLITE_MAX_CFM_WITH_BYPASS;
        }
      } else if (intSummerSupplyAirCFM < intVENLITE_MIN_CFM_NO_BYPASS) {
        intSummerSupplyAirCFM = intVENLITE_MIN_CFM_NO_BYPASS;
      } else if (intSummerSupplyAirCFM > intVENLITE_MAX_CFM_NO_BYPASS) {
        intSummerSupplyAirCFM = intVENLITE_MAX_CFM_NO_BYPASS;
      }
      break;
    case ClsID.intProdTypeIdVentumPlus:
      if (intUAL === ClsID.intUAL_Admin || intUAL === ClsID.intUAL_IntAdmin ||
          intUAL === ClsID.intUAL_IntLvl_2 || intUAL === ClsID.intUAL_IntLvl_1
      ) {
        if (ckbPHI === 1) {
          if (intSummerSupplyAirCFM < intVENPLUS_MIN_CFM_PHI) {
            intSummerSupplyAirCFM = intVENPLUS_MIN_CFM_PHI;
          } else if (intSummerSupplyAirCFM > intVENPLUS_MAX_CFM_PHI) {
            intSummerSupplyAirCFM = intVENPLUS_MAX_CFM_PHI;
          }
        } else if (ckbBypassVal === 1) {
          if (intSummerSupplyAirCFM < intVENPLUS_INT_USERS_MIN_CFM_WITH_BYPASS) {
            intSummerSupplyAirCFM = intVENPLUS_INT_USERS_MIN_CFM_WITH_BYPASS;
          } else if (intSummerSupplyAirCFM > intVENPLUS_INT_USERS_MAX_CFM_WITH_BYPASS) {
            intSummerSupplyAirCFM = intVENPLUS_INT_USERS_MAX_CFM_WITH_BYPASS;
          }
        } else if (intSummerSupplyAirCFM < intVENPLUS_INT_USERS_MIN_CFM_NO_BYPASS) {
          intSummerSupplyAirCFM = intVENPLUS_INT_USERS_MIN_CFM_NO_BYPASS;
        } else if (intSummerSupplyAirCFM > intVENPLUS_INT_USERS_MAX_CFM_NO_BYPASS) {
          intSummerSupplyAirCFM = intVENPLUS_INT_USERS_MAX_CFM_NO_BYPASS;
        }
      } else if (ckbBypassVal === 1) {
        if (intSummerSupplyAirCFM < intVENPLUS_MIN_CFM_WITH_BYPASS) {
          intSummerSupplyAirCFM = intVENPLUS_MIN_CFM_WITH_BYPASS;
        } else if (intSummerSupplyAirCFM > intVENPLUS_MAX_CFM_WITH_BYPASS) {
          intSummerSupplyAirCFM = intVENPLUS_MAX_CFM_WITH_BYPASS;
        }
      } else if (intSummerSupplyAirCFM < intVENPLUS_MIN_CFM_NO_BYPASS) {
        intSummerSupplyAirCFM = intVENPLUS_MIN_CFM_NO_BYPASS;
      } else if (intSummerSupplyAirCFM > intVENPLUS_MAX_CFM_NO_BYPASS) {
        intSummerSupplyAirCFM = intVENPLUS_MAX_CFM_NO_BYPASS;
      }
      break;
    case ClsID.intProdTypeIdTerra:
      if (
        intUAL === ClsID.intUAL_Admin ||
        intUAL === ClsID.intUAL_IntAdmin ||
        intUAL === ClsID.intUAL_IntLvl_2 ||
        intUAL === ClsID.intUAL_IntLvl_1
      ) {
        if (ckbBypassVal === 1) {
          if (intSummerSupplyAirCFM < intTERA_INT_USERS_MIN_CFM_WITH_BYPASS) {
            intSummerSupplyAirCFM = intTERA_INT_USERS_MIN_CFM_WITH_BYPASS;
          } else if (intSummerSupplyAirCFM > intTERA_INT_USERS_MAX_CFM_WITH_BYPASS) {
            intSummerSupplyAirCFM = intTERA_INT_USERS_MAX_CFM_WITH_BYPASS;
          }
        } else if (intSummerSupplyAirCFM < intTERA_INT_USERS_MIN_CFM_NO_BYPASS) {
          intSummerSupplyAirCFM = intTERA_INT_USERS_MIN_CFM_NO_BYPASS;
        } else if (intSummerSupplyAirCFM > intTERA_INT_USERS_MAX_CFM_NO_BYPASS) {
          intSummerSupplyAirCFM = intTERA_INT_USERS_MAX_CFM_NO_BYPASS;
        }
      } else if (ckbBypassVal === 1) {
        if (intSummerSupplyAirCFM < intTERA_MIN_CFM_WITH_BYPASS) {
          intSummerSupplyAirCFM = intTERA_MIN_CFM_WITH_BYPASS;
        } else if (intSummerSupplyAirCFM > intTERA_MAX_CFM_WITH_BYPASS) {
          intSummerSupplyAirCFM = intTERA_MAX_CFM_WITH_BYPASS;
        }
      } else if (intSummerSupplyAirCFM < intTERA_MIN_CFM_NO_BYPASS) {
        intSummerSupplyAirCFM = intTERA_MIN_CFM_NO_BYPASS;
      } else if (intSummerSupplyAirCFM > intTERA_MAX_CFM_NO_BYPASS) {
        intSummerSupplyAirCFM = intTERA_MAX_CFM_NO_BYPASS;
      }
      break;
    default:
      break;
  }

  return intSummerSupplyAirCFM;
};

export const getSummerReturnAirCFM = (
  summerReturnAirCFM: any,
  values: {
    txbSummerSupplyAirCFM: any;
    ddlOrientation: any;
    ddlUnitModel: any;
    intProductTypeID: any;
    ckbBypass: any;
    ckbPHI: any;
    intUnitTypeID: any;
  },
  intUAL: any,
  db: { dbtSelVentumHUnitModel: any[]; dbtSelVentumLiteUnitModel: any[]; dbtSelVentumPlusUnitModel: any[] }
) => {
  const intSummerSupplyAirCFM = Number(values.txbSummerSupplyAirCFM);
  const intOrientationID = Number(values.ddlOrientation);
  const intUnitModelID = Number(values.ddlUnitModel);
  const intProductTypeID = Number(values.intProductTypeID);
  const ckbBypassVal = Number(values.ckbBypass);
  let intSummerReturnAirCFM = Number(summerReturnAirCFM);
  const intUnitTypeID = Number(values.intUnitTypeID);
  const ckbBypass = Number(values.ckbBypass);
  const ckbPHI = Number(values.ckbPHI);

  if ( intOrientationID === ClsID.intOrientationIdHorizontal && intSummerSupplyAirCFM > intNOVA_HORIZONTAL_MAX_CFM) {
    intSummerReturnAirCFM = intNOVA_HORIZONTAL_MAX_CFM;
  }

  let dtModel: any = [];
  switch (intProductTypeID) {
    case ClsID.intProdTypeIdNova:
      if (intSummerReturnAirCFM < intNOVA_MIN_CFM) {
        intSummerReturnAirCFM = intNOVA_MIN_CFM;
      } else if (intSummerReturnAirCFM > intNOVA_MAX_CFM) {
        intSummerReturnAirCFM = intNOVA_MAX_CFM;
      }
      break;
    case ClsID.intProdTypeIdVentum:
      dtModel = db?.dbtSelVentumHUnitModel?.filter((item: { id: number }) => item.id === intUnitModelID);

      if (intUAL === ClsID.intUAL_Admin || intUAL === ClsID.intUAL_IntAdmin || 
          intUAL === ClsID.intUAL_IntLvl_2 ||  intUAL === ClsID.intUAL_IntLvl_1
      ) {
        if (ckbPHI === 1) {
          if (intSummerReturnAirCFM < Math.max(intSummerSupplyAirCFM * 0.5, intVEN_MIN_CFM_PHI)) {
            intSummerReturnAirCFM = Number(Math.max(intSummerSupplyAirCFM * 0.5, intVEN_MIN_CFM_PHI));
          } else if (intSummerReturnAirCFM > Math.min(Number(intSummerSupplyAirCFM) * 2, intVEN_MAX_CFM_PHI)) {
            intSummerReturnAirCFM = Number(Math.min(intSummerSupplyAirCFM * 2, intVEN_MAX_CFM_PHI));
          }
        } else if (ckbBypassVal === 1) {
          if (intSummerReturnAirCFM < Math.max(intSummerSupplyAirCFM * 0.5, intVEN_INT_USERS_MIN_CFM_WITH_BYPASS)) {
            intSummerReturnAirCFM = Number(Math.max(intSummerSupplyAirCFM * 0.5, intVEN_INT_USERS_MIN_CFM_WITH_BYPASS));
          } else if (intSummerReturnAirCFM > Math.min(Number(intSummerSupplyAirCFM) * 2, intVEN_INT_USERS_MAX_CFM_WITH_BYPASS)) {
            intSummerReturnAirCFM = Number(Math.min(intSummerSupplyAirCFM * 2, intVEN_INT_USERS_MAX_CFM_WITH_BYPASS));
          }
        } else if (intSummerReturnAirCFM < Math.max(Number(intSummerSupplyAirCFM) * 0.5, intVEN_INT_USERS_MIN_CFM_NO_BYPASS)) {
          intSummerReturnAirCFM = Number(Math.max(intSummerSupplyAirCFM * 0.5, intVEN_INT_USERS_MIN_CFM_NO_BYPASS));
        } else if (intSummerReturnAirCFM > Math.min(intSummerSupplyAirCFM * 2, intVEN_INT_USERS_MAX_CFM_NO_BYPASS) ) {
          intSummerReturnAirCFM = Number(Math.min(intSummerSupplyAirCFM * 2, intVEN_INT_USERS_MAX_CFM_NO_BYPASS));
        }
      } else if (ckbBypassVal === 1) {
        if (intSummerReturnAirCFM < Number(dtModel.Rows?.[0]?.erv_cfm_min_ext_users)) {
          intSummerReturnAirCFM = Number(dtModel.Rows?.[0]?.erv_cfm_min_ext_users);
        } else if (intSummerReturnAirCFM > Number(dtModel.Rows?.[0]?.erv_cfm_max_ext_users)) {
          intSummerReturnAirCFM = Number(dtModel.Rows?.[0]?.erv_cfm_max_ext_users);
        }
      } else if (intSummerReturnAirCFM < Number(dtModel.Rows?.[0]?.erv_cfm_min_ext_users)) {
        intSummerReturnAirCFM = Number(dtModel.Rows?.[0]?.erv_cfm_min_ext_users);
      } else if (intSummerReturnAirCFM > Number(dtModel.Rows?.[0]?.erv_cfm_max_ext_users)) {
        intSummerReturnAirCFM = Number(dtModel.Rows?.[0]?.erv_cfm_max_ext_users);
      }
      break;
    case ClsID.intProdTypeIdVentumLite:
      dtModel = db?.dbtSelVentumLiteUnitModel?.filter((item: { id: number }) => item.id === intUnitModelID);

      if (intUAL === ClsID.intUAL_Admin || intUAL === ClsID.intUAL_IntAdmin ||
          intUAL === ClsID.intUAL_IntLvl_2 || intUAL === ClsID.intUAL_IntLvl_1) {
        if (ckbPHI === 1) {
          if (intSummerReturnAirCFM < Math.max(intSummerSupplyAirCFM * 0.5, intVENLITE_INT_USERS_MIN_CFM_WITH_BYPASS)) {
            intSummerReturnAirCFM = Number(Math.max(intSummerSupplyAirCFM * 0.5, intVENLITE_INT_USERS_MIN_CFM_WITH_BYPASS));
          } else if (intSummerReturnAirCFM >Math.min(intSummerSupplyAirCFM * 2, intVENLITE_INT_USERS_MAX_CFM_WITH_BYPASS)) {
            intSummerReturnAirCFM = Number( Math.min(intSummerSupplyAirCFM * 2, intVENLITE_INT_USERS_MAX_CFM_WITH_BYPASS));
          }
        } else if (intSummerReturnAirCFM < Math.max(intSummerSupplyAirCFM * 0.5, intVENLITE_INT_USERS_MIN_CFM_NO_BYPASS)) {
          intSummerReturnAirCFM = Number(Math.max(intSummerSupplyAirCFM * 0.5, intVENLITE_INT_USERS_MIN_CFM_NO_BYPASS));
        } else if (intSummerReturnAirCFM > Math.min(intSummerSupplyAirCFM * 2, intVENLITE_INT_USERS_MAX_CFM_NO_BYPASS)) {
          intSummerReturnAirCFM = Number(Math.min(intSummerSupplyAirCFM * 2, intVENLITE_INT_USERS_MAX_CFM_NO_BYPASS));
        }
      } else if (ckbBypassVal === 1) {
        if (intSummerReturnAirCFM < Number(dtModel.Rows?.[0]?.erv_cfm_min_ext_users)) {
          intSummerReturnAirCFM = Number(dtModel.Rows?.[0]?.erv_cfm_min_ext_users);
        } else if (intSummerReturnAirCFM > Number(dtModel.Rows?.[0]?.erv_cfm_max_ext_users)) {
          intSummerReturnAirCFM = Number(dtModel.Rows?.[0]?.erv_cfm_max_ext_users);
        }
      } else if (intSummerReturnAirCFM < Number(dtModel.Rows?.[0]?.erv_cfm_min_ext_users)) {
        intSummerReturnAirCFM = Number(dtModel.Rows?.[0]?.erv_cfm_min_ext_users);
      } else if (intSummerReturnAirCFM > Number(dtModel.Rows?.[0]?.erv_cfm_max_ext_users)) {
        intSummerReturnAirCFM = Number(dtModel.Rows?.[0]?.erv_cfm_max_ext_users);
      }
      break;
    case ClsID.intProdTypeIdVentumPlus:
      dtModel = db?.dbtSelVentumPlusUnitModel?.filter((item: { id: number }) => item.id === intUnitModelID);

      if (intUAL === ClsID.intUAL_Admin || intUAL === ClsID.intUAL_IntAdmin ||
          intUAL === ClsID.intUAL_IntLvl_2 || intUAL === ClsID.intUAL_IntLvl_1
      ) {
        if (ckbPHI === 1) {
          if (intSummerReturnAirCFM < Math.max(intSummerSupplyAirCFM * 0.5, intVENPLUS_MIN_CFM_PHI)) {
            intSummerReturnAirCFM = Number(Math.max(intSummerSupplyAirCFM * 0.5, intVENPLUS_MIN_CFM_PHI));
          } else if (intSummerReturnAirCFM > Math.min(intSummerSupplyAirCFM * 2, intVENPLUS_MAX_CFM_PHI)) {
            intSummerReturnAirCFM = Number(Math.min(intSummerSupplyAirCFM * 2, intVENPLUS_MAX_CFM_PHI));
          }
        } else if (ckbBypassVal === 1) {
          if (intSummerReturnAirCFM < Math.max(intSummerSupplyAirCFM * 0.5, intVENPLUS_INT_USERS_MIN_CFM_WITH_BYPASS)) {
            intSummerReturnAirCFM = Number(Math.max(intSummerSupplyAirCFM * 0.5, intVENPLUS_INT_USERS_MIN_CFM_WITH_BYPASS));
          } else if (intSummerReturnAirCFM > Math.min(intSummerSupplyAirCFM * 2, intVENPLUS_INT_USERS_MAX_CFM_WITH_BYPASS)) {
            intSummerReturnAirCFM = Number(Math.min(intSummerSupplyAirCFM * 2, intVENPLUS_INT_USERS_MAX_CFM_WITH_BYPASS));
          }
        } else if (intSummerReturnAirCFM < Math.max(intSummerSupplyAirCFM * 0.5, intVENPLUS_INT_USERS_MIN_CFM_NO_BYPASS)) {
          intSummerReturnAirCFM = Number(Math.max(intSummerSupplyAirCFM * 0.5, intVENPLUS_INT_USERS_MIN_CFM_NO_BYPASS));
        } else if (intSummerReturnAirCFM > Math.min(intSummerSupplyAirCFM * 2, intVENPLUS_INT_USERS_MAX_CFM_NO_BYPASS)) {
          intSummerReturnAirCFM = Number(Math.min(intSummerSupplyAirCFM * 2, intVENPLUS_INT_USERS_MAX_CFM_NO_BYPASS));
        }
      } else if (ckbBypassVal === 1) {
        if (intSummerReturnAirCFM < Number(dtModel.Rows?.[0]?.erv_cfm_min_ext_users)) {
          intSummerReturnAirCFM = Number(dtModel.Rows?.[0]?.erv_cfm_min_ext_users);
        } else if (intSummerReturnAirCFM > Number(dtModel.Rows?.[0]?.erv_cfm_max_ext_users)) {
          intSummerReturnAirCFM = Number(dtModel.Rows?.[0]?.erv_cfm_max_ext_users);
        }
      } else if (intSummerReturnAirCFM < Number(dtModel.Rows?.[0]?.erv_cfm_min_ext_users)) {
        intSummerReturnAirCFM = Number(dtModel.Rows?.[0]?.erv_cfm_min_ext_users);
      } else if (intSummerReturnAirCFM > Number(dtModel.Rows?.[0]?.erv_cfm_max_ext_users)) {
        intSummerReturnAirCFM = Number(dtModel.Rows?.[0]?.erv_cfm_max_ext_users);
      }
      break;
    default:
      break;
  }

  if ((intProductTypeID === ClsID.intProdTypeIdVentum || intProductTypeID === ClsID.intProdTypeIdVentumLite ||
      intProductTypeID === ClsID.intProdTypeIdVentumPlus) && intUnitTypeID === ClsID.intUnitTypeIdHRV) {
    if (intSummerReturnAirCFM < intSummerSupplyAirCFM * 0.5) {
      intSummerReturnAirCFM = Math.ceil(intSummerSupplyAirCFM * 0.5);
    } else if (intSummerReturnAirCFM > Number(intSummerSupplyAirCFM) * 2) {
      intSummerReturnAirCFM = Math.ceil(intSummerSupplyAirCFM * 2);
    }
  } else if (
    (intProductTypeID === ClsID.intProdTypeIdVentum || intProductTypeID === ClsID.intProdTypeIdVentumLite ||
     intProductTypeID === ClsID.intProdTypeIdVentumPlus) && intUnitTypeID === ClsID.intUnitTypeIdERV
  ) {
    switch (intProductTypeID) {
      case ClsID.intProdTypeIdVentum:
        if (intUAL === ClsID.intUAL_Admin || intUAL === ClsID.intUAL_IntAdmin ||
            intUAL === ClsID.intUAL_IntLvl_2 || intUAL === ClsID.intUAL_IntLvl_1
        ) {
          if (ckbBypass === 1) {
            if (intSummerReturnAirCFM < intVEN_INT_USERS_MIN_CFM_WITH_BYPASS) {
              intSummerReturnAirCFM = intVEN_INT_USERS_MIN_CFM_WITH_BYPASS;
            } else if (intSummerReturnAirCFM > intVEN_INT_USERS_MAX_CFM_WITH_BYPASS) {
              intSummerReturnAirCFM = intVEN_INT_USERS_MAX_CFM_WITH_BYPASS;
            }
          } else if (intSummerReturnAirCFM < intVEN_INT_USERS_MIN_CFM_NO_BYPASS) {
            intSummerReturnAirCFM = intVEN_INT_USERS_MIN_CFM_NO_BYPASS;
          } else if (intSummerReturnAirCFM > intVEN_INT_USERS_MAX_CFM_NO_BYPASS) {
            intSummerReturnAirCFM = intVEN_INT_USERS_MAX_CFM_NO_BYPASS;
          }
        } else if (ckbBypass === 1) {
          if (intSummerReturnAirCFM < intVEN_MIN_CFM_WITH_BYPASS) {
            intSummerReturnAirCFM = intVEN_MIN_CFM_WITH_BYPASS;
          } else if (intSummerReturnAirCFM > intVEN_MAX_CFM_WITH_BYPASS) {
            intSummerReturnAirCFM = intVEN_MAX_CFM_WITH_BYPASS;
          }
        } else if (intSummerReturnAirCFM < intVEN_MIN_CFM_NO_BYPASS) {
          intSummerReturnAirCFM = intVEN_MIN_CFM_NO_BYPASS;
        } else if (intSummerReturnAirCFM > intVEN_MAX_CFM_NO_BYPASS) {
          intSummerReturnAirCFM = intVEN_MAX_CFM_NO_BYPASS;
        }

        break;
      case ClsID.intProdTypeIdVentumLite:
        if (intUAL === ClsID.intUAL_Admin || intUAL === ClsID.intUAL_IntAdmin ||
            intUAL === ClsID.intUAL_IntLvl_2 || intUAL === ClsID.intUAL_IntLvl_1
        ) {
          if (ckbBypass === 1) {
            if (intSummerReturnAirCFM < intVENLITE_INT_USERS_MIN_CFM_WITH_BYPASS) {
              intSummerReturnAirCFM = intVENLITE_INT_USERS_MIN_CFM_WITH_BYPASS;
            } else if (intSummerReturnAirCFM > intVENLITE_INT_USERS_MAX_CFM_WITH_BYPASS) {
              intSummerReturnAirCFM = intVENLITE_INT_USERS_MAX_CFM_WITH_BYPASS;
            }
          } else if (intSummerReturnAirCFM < intVENLITE_INT_USERS_MIN_CFM_NO_BYPASS) {
            intSummerReturnAirCFM = intVENLITE_INT_USERS_MIN_CFM_NO_BYPASS;
          } else if (intSummerReturnAirCFM > intVENLITE_INT_USERS_MAX_CFM_NO_BYPASS) {
            intSummerReturnAirCFM = intVENLITE_INT_USERS_MAX_CFM_NO_BYPASS;
          }
        } else if (ckbBypass === 1) {
          if (intSummerReturnAirCFM < intVENLITE_MIN_CFM_WITH_BYPASS) {
            intSummerReturnAirCFM = intVENLITE_MIN_CFM_WITH_BYPASS;
          } else if (intSummerReturnAirCFM > intVENLITE_MAX_CFM_WITH_BYPASS) {
            intSummerReturnAirCFM = intVENLITE_MAX_CFM_WITH_BYPASS;
          }
        } else if (intSummerReturnAirCFM < intVENLITE_MIN_CFM_NO_BYPASS) {
          intSummerReturnAirCFM = intVENLITE_MIN_CFM_NO_BYPASS;
        } else if (intSummerReturnAirCFM > intVENLITE_MAX_CFM_NO_BYPASS) {
          intSummerReturnAirCFM = intVENLITE_MAX_CFM_NO_BYPASS;
        }

        break;
      case ClsID.intProdTypeIdVentumPlus:
        if (intUAL === ClsID.intUAL_Admin || intUAL === ClsID.intUAL_IntAdmin ||
            intUAL === ClsID.intUAL_IntLvl_2 || intUAL === ClsID.intUAL_IntLvl_1
        ) {
          if (ckbBypass === 1) {
            if (intSummerReturnAirCFM < intVENPLUS_INT_USERS_MIN_CFM_WITH_BYPASS) {
              intSummerReturnAirCFM = intVENPLUS_INT_USERS_MIN_CFM_WITH_BYPASS;
            } else if (intSummerReturnAirCFM > intVENPLUS_INT_USERS_MAX_CFM_WITH_BYPASS) {
              intSummerReturnAirCFM = intVENPLUS_INT_USERS_MAX_CFM_WITH_BYPASS;
            }
          } else if (intSummerReturnAirCFM < intVENPLUS_INT_USERS_MIN_CFM_NO_BYPASS) {
            intSummerReturnAirCFM = intVENPLUS_INT_USERS_MIN_CFM_NO_BYPASS;
          } else if (intSummerReturnAirCFM > intVENPLUS_INT_USERS_MAX_CFM_NO_BYPASS) {
            intSummerReturnAirCFM = intVENPLUS_INT_USERS_MAX_CFM_NO_BYPASS;
          }
        } else if (ckbBypass === 1) {
          if (intSummerReturnAirCFM < intVENPLUS_MIN_CFM_WITH_BYPASS) {
            intSummerReturnAirCFM = intVENPLUS_MIN_CFM_WITH_BYPASS;
          } else if (intSummerReturnAirCFM > intVENPLUS_MAX_CFM_WITH_BYPASS) {
            intSummerReturnAirCFM = intVENPLUS_MAX_CFM_WITH_BYPASS;
          }
        } else if (intSummerReturnAirCFM < intVENPLUS_MIN_CFM_NO_BYPASS) {
          intSummerReturnAirCFM = intVENPLUS_MIN_CFM_NO_BYPASS;
        } else if (intSummerReturnAirCFM > intVENPLUS_MAX_CFM_NO_BYPASS) {
          intSummerReturnAirCFM = intVENPLUS_MAX_CFM_NO_BYPASS;
        }

        break;
      default:
        break;
    }
  }

  return intSummerReturnAirCFM;
};

export const getSupplyAirESPInfo = (
  supplyAirESP: any,
  intProductTypeID: any,
  intUnitModelID: any
) => {
  let dblSupplyAirESP = Number(supplyAirESP);

  if (intProductTypeID === ClsID.intProdTypeIdNova) {
    if (
      intUnitModelID === ClsID.intNovaUnitModelIdA16IN ||
      intUnitModelID === ClsID.intNovaUnitModelIdB20IN ||
      intUnitModelID === ClsID.intNovaUnitModelIdA18OU ||
      intUnitModelID === ClsID.intNovaUnitModelIdB22OU
    ) {
      if (dblSupplyAirESP > 2.0) {
        dblSupplyAirESP = 2.0;
      }
    } else if (dblSupplyAirESP > 3.0) {
      dblSupplyAirESP = 3.0;
    }
  }

  return dblSupplyAirESP;
};

export const getExhaustAirESP = (
  returnAirESP: any,
  intProductTypeID: any,
  intUnitTypeID: any,
  intUnitModelID: any
) => {
  let dblReturnAirESP = Number(returnAirESP);

  if (intProductTypeID === ClsID.intProdTypeIdNova) {
    if (
      intUnitModelID === ClsID.intNovaUnitModelIdA16IN ||
      intUnitModelID === ClsID.intNovaUnitModelIdB20IN ||
      intUnitModelID === ClsID.intNovaUnitModelIdA18OU ||
      intUnitModelID === ClsID.intNovaUnitModelIdB22OU
    ) {
      if (dblReturnAirESP > 2.0) {
        dblReturnAirESP = 2.0;
      }
    } else if (dblReturnAirESP > 3.0) {
      dblReturnAirESP = 3.0;
    }
  }

  return dblReturnAirESP;
};

export const getBypass = (
  db: { dbtSelNovaUnitModel: any[] },
  intProductTypeID: any,
  intUnitModelID: any,
  intOrientationID: any,
  ckbBypass: number
) => {
  const result = { text: '', enabled: true, checked: ckbBypass };
  if (intProductTypeID === ClsID.intProdTypeIdNova) {
    const dtUnitModel = db?.dbtSelNovaUnitModel?.filter(
      (item: { id: any }) => item.id === intUnitModelID
    );

    if (ckbBypass === 1) {
      result.enabled = true;
      result.text = '';
    } else {
      result.checked = 0;
      result.enabled = false;

      if (
        intUnitModelID === ClsID.intNovaUnitModelIdC70IN ||
        intUnitModelID === ClsID.intNovaUnitModelIdC70OU
      ) {
        result.text = ' Contact Oxygen8 applications for Bypass model';
      } else {
        result.text = ' Not available for selected model';
      }
    }

    if (intOrientationID === ClsID.intOrientationIdHorizontal) {
      const drUnitModelBypassHorUnit = dtUnitModel?.filter(
        (item: { bypass_exist_horizontal_unit: number }) => item.bypass_exist_horizontal_unit === 1
      );

      if (drUnitModelBypassHorUnit && drUnitModelBypassHorUnit?.length > 0) {
        result.enabled = true;
        result.text = '';
      } else {
        result.checked = 0;
        result.enabled = false;
        result.text = ' Not available for selected model';
      }
    }

    return result;
  }
  return result;
};

export const getUnitVoltage = (
  db: {
    dbtSelNovaUnitModelVoltageLink: any[];
    dbtSelVentumHUnitModelVoltageLink: any[];
    dbtSelVentumLiteUnitModelVoltageLink: any[];
    dbtSelVentumPlusUnitModelVoltageLink: any[];
    dbtSelTerraUnitModelVoltageLink: any[];
    dbtSelElectricalVoltage: any[];
  },
  intProductTypeID: any,
  strUnitModelValue: any
) => {
  let modelVoltageLink = [];

  switch (intProductTypeID) {
    case ClsID.intProdTypeIdNova:
      modelVoltageLink = db?.dbtSelNovaUnitModelVoltageLink;
      break;
    case ClsID.intProdTypeIdVentum:
      modelVoltageLink = db?.dbtSelVentumHUnitModelVoltageLink;
      break;
    case ClsID.intProdTypeIdVentumLite:
      modelVoltageLink = db?.dbtSelVentumLiteUnitModelVoltageLink;
      break;
    case ClsID.intProdTypeIdVentumPlus:
      modelVoltageLink = db?.dbtSelVentumPlusUnitModelVoltageLink;
      break;
    case ClsID.intProdTypeIdTerra:
      modelVoltageLink = db?.dbtSelTerraUnitModelVoltageLink;
      break;
    default:
      break;
  }

  const dtLink =
    modelVoltageLink?.filter(
      (item: { unit_model_value: any }) => item.unit_model_value === strUnitModelValue
    ) || [];
  let dtVoltage = db?.dbtSelElectricalVoltage;
  if (intProductTypeID === ClsID.intProdTypeIdTerra && true) {
    dtVoltage = db?.dbtSelElectricalVoltage?.filter(
      (item: { terra_spp: number }) => item.terra_spp === 1
    );
  }

  const unitVoltage = dtVoltage?.filter(
    (e: { id: any }) =>
      dtLink?.filter((e_link: { voltage_id: any }) => e.id === e_link.voltage_id)?.length > 0
  );
  const ddlUnitVoltageId = unitVoltage?.[0]?.id || 0;

  return { unitVoltageList: unitVoltage, ddlUnitVoltageId };
};


export const getComponentInfo = (
  db: { dbtSelUnitCoolingHeating: any; dbtSelUnitHeatExchanger: any },
  intProductTypeID: any,
  intUnitTypeID: any
) => {
  const unitCoolingHeadingInfo = db?.dbtSelUnitCoolingHeating;
  const heatExchangeInfo = db?.dbtSelUnitHeatExchanger;

  let dtPreheatComp = unitCoolingHeadingInfo;
  let dtHeatExchComp = heatExchangeInfo;
  let dtCoolingComp = unitCoolingHeadingInfo;
  let dtHeatingComp = unitCoolingHeadingInfo;

  if (intUnitTypeID === ClsID.intUnitTypeIdERV) {
    dtPreheatComp =
      unitCoolingHeadingInfo?.filter((e: { erv_preheat: any }) => Number(e.erv_preheat) === 1) ||
      [];

    if (intProductTypeID === ClsID.intProdTypeIdVentumLite) {
      dtPreheatComp =
        unitCoolingHeadingInfo?.filter(
          (item: { id: any }) => Number(item.id) !== ClsID.intCompIdHWC
        ) || [];
    }

    dtHeatExchComp = heatExchangeInfo?.filter((e: { erv: any }) => Number(e.erv) === 1) || [];

    dtCoolingComp =
      unitCoolingHeadingInfo?.filter((e: { erv_cooling: any }) => Number(e.erv_cooling) === 1) ||
      [];

    dtHeatingComp =
      unitCoolingHeadingInfo?.filter((e: { erv_heating: any }) => Number(e.erv_heating) === 1) ||
      [];
  } else if (intUnitTypeID === ClsID.intUnitTypeIdHRV) {
    dtPreheatComp =
      unitCoolingHeadingInfo?.filter((e: { hrv_preheat: any }) => Number(e.hrv_preheat) === 1) ||
      [];

    if (intProductTypeID === ClsID.intProdTypeIdVentumLite) {
      dtPreheatComp = unitCoolingHeadingInfo?.filter(
        (e: { id: string }) => parseInt(e.id, 10) !== ClsID.intCompIdHWC
      );
    }

    dtHeatExchComp = heatExchangeInfo?.filter((e: { hrv: any }) => Number(e.hrv) === 1) || [];

    dtCoolingComp =
      unitCoolingHeadingInfo?.filter((e: { hrv_cooling: any }) => Number(e.hrv_cooling) === 1) ||
      [];

    dtHeatingComp =
      unitCoolingHeadingInfo?.filter((e: { hrv_heating: any }) => Number(e.hrv_heating) === 1) ||
      [];
  } else if (intUnitTypeID === ClsID.intUnitTypeIdAHU) {
    dtHeatExchComp = heatExchangeInfo?.filter((e: { fc: any }) => Number(e.fc) === 1) || [];

    dtPreheatComp =
      unitCoolingHeadingInfo?.filter((e: { fc_preheat: any }) => Number(e.fc_preheat) === 1) || [];
    dtCoolingComp =
      unitCoolingHeadingInfo?.filter((e: { fc_cooling: any }) => Number(e.fc_cooling) === 1) || [];
    dtHeatingComp =
      unitCoolingHeadingInfo?.filter((e: { fc_heating: any }) => Number(e.fc_heating) === 1) || [];
  }

  return {
    dtPreheatComp,
    dtHeatExchComp,
    dtCoolingComp,
    dtHeatingComp,
    dtReheatComp: unitCoolingHeadingInfo,
  };
};

export const getPreheatElecHeaterInstallationInfo = (
  db: { dbtSelElecHeaterInstallation: any[]; dbtSelElectricHeaterInstallProdTypeLink: any },
  intPreheatCompID: any,
  intLocationID: any,
  intProductTypeID: any
) => {
  const returnInfo: any = {
    ddlPreheatElecHeaterInstallationDataTbl: [],
    ddlPreheatElecHeaterInstallationId: 0,
  };

  let dtPreheatElecHeaterInstallation = db?.dbtSelElecHeaterInstallation?.filter((item: { id: number }) => item.id !== 1);
  if (intPreheatCompID === ClsID.intCompIdElecHeater || intPreheatCompID === ClsID.intCompIdAuto) {
    returnInfo.ddlPreheatElecHeaterInstallationDataTbl = dtPreheatElecHeaterInstallation;

    if (intLocationID === ClsID.intLocationIdOutdoor) {
      switch (intProductTypeID) {
        case ClsID.intProdTypeIdNova:
        case ClsID.intProdTypeIdVentum:
        case ClsID.intProdTypeIdVentumLite:
        case ClsID.intProdTypeIdTerra:
          dtPreheatElecHeaterInstallation = dtPreheatElecHeaterInstallation?.filter((item: { id: any }) => item.id === ClsID.intElecHeaterInstallIdInCasingField);
          break;
        case ClsID.intProdTypeIdVentumPlus:
          dtPreheatElecHeaterInstallation = dtPreheatElecHeaterInstallation?.filter((item: { id: any }) => item.id === ClsID.intElecHeaterInstallIdInCasingFactory);
          break;
        default:
          break;
      }
    } else {
      let dtLink = db?.dbtSelElectricHeaterInstallProdTypeLink;
      dtLink =dtLink?.filter((item: { prod_type_id: any }) => item.prod_type_id === intProductTypeID) || [];

      dtPreheatElecHeaterInstallation = dtPreheatElecHeaterInstallation?.filter(
        (e: { id: any }) => dtLink?.filter((e_link: { elec_heater_install_id: any }) => e.id === e_link.elec_heater_install_id)?.length === 1 // 1: Matching items, 0: Not matching items
      );

      switch (intProductTypeID) {
        case ClsID.intProdTypeIdNova:
        case ClsID.intProdTypeIdVentum:
          returnInfo.ddlPreheatElecHeaterInstallationId =
            ClsID.intElecHeaterInstallIdInCasingField.toString();
          break;
        case ClsID.intProdTypeIdTerra:
        case ClsID.intProdTypeIdVentumPlus:
          returnInfo.ddlPreheatElecHeaterInstallationId =
            ClsID.intElecHeaterInstallIdInCasingFactory.toString();
          break;
        case ClsID.intProdTypeIdVentumLite:
          dtPreheatElecHeaterInstallation = dtPreheatElecHeaterInstallation?.filter(
            (item: { id: any }) => item.id === ClsID.intElecHeaterInstallIdDuctMounted
          );
          returnInfo.ddlPreheatElecHeaterInstallationDataTbl = dtPreheatElecHeaterInstallation;
          break;
        default:
          break;
      }
    }

    returnInfo.ddlPreheatElecHeaterInstallationId = dtPreheatElecHeaterInstallation?.[0]?.id;

    return returnInfo;
  }

  return [];
};

// export const getItemsAddedOnIDDataTable = (
//   dt: string | any[],
//   strColumnMultipleID: string,
//   intMatchID: number
// ) => {
//   const newDt = [];

//   for (let i = 0; i < dt?.length; i += 1) {
//     const strArrID = dt[i][strColumnMultipleID].split(',');

//     for (let j = 0; j < strArrID?.length; j += 1) {
//       if (parseInt(strArrID[j], 10) === intMatchID) {
//         const dr = {
//           id: parseInt(dt[i].id, 10),
//           items: dt[i].items,
//         };

//         newDt.push(dr);
//         break;
//       }
//     }
//   }

//   return newDt;
// };

export const getCustomInputsInfo = (
  intPreheatCompID: any,
  intCoolingCompID: any,
  intHeatingCompID: any,
  intReheatCompID: any,
  intUnitTypeID: any
) => {
  const returnInfo = {
    divPreheatHWC_UseFlowRateVisible: false,
    divPreheatHWC_FlowRateVisible: false,
    divPreheatHWC_UseCapVisible: false,
    divPreheatHWC_CapVisible: false,
    divCoolingCWC_UseCapVisible: false,
    divCoolingCWC_CapVisible: false,
    divCoolingCWC_UseFlowRateVisible: false,
    divCoolingCWC_FlowRateVisible: false,
    divHeatingHWC_UseCapVisible: false,
    divHeatingHWC_CapVisible: false,
    divHeatingHWC_UseFlowRateVisible: false,
    divHeatingHWC_FlowRateVisible: false,
    divReheatHWC_UseCapVisible: false,
    divReheatHWC_CapVisible: false,
    divReheatHWC_UseFlowRateVisible: false,
    divReheatHWC_FlowRateVisible: false,
  };

  if (intPreheatCompID === ClsID.intCompIdHWC) {
    returnInfo.divPreheatHWC_UseFlowRateVisible = true;
    returnInfo.divPreheatHWC_FlowRateVisible = true;

    if (intUnitTypeID === ClsID.intUnitTypeIdAHU) {
      returnInfo.divPreheatHWC_UseCapVisible = true;
      returnInfo.divPreheatHWC_CapVisible = true;
    } else {
      returnInfo.divPreheatHWC_UseCapVisible = false;
      returnInfo.divPreheatHWC_CapVisible = false;
    }
  } else {
    returnInfo.divPreheatHWC_UseCapVisible = false;
    returnInfo.divPreheatHWC_CapVisible = false;
    returnInfo.divPreheatHWC_UseFlowRateVisible = false;
    returnInfo.divPreheatHWC_FlowRateVisible = false;
  }

  if (intCoolingCompID === ClsID.intCompIdCWC) {
    returnInfo.divCoolingCWC_UseCapVisible = true;
    returnInfo.divCoolingCWC_CapVisible = true;
    returnInfo.divCoolingCWC_UseFlowRateVisible = true;
    returnInfo.divCoolingCWC_FlowRateVisible = true;
  } else {
    returnInfo.divCoolingCWC_UseCapVisible = false;
    returnInfo.divCoolingCWC_CapVisible = false;
    returnInfo.divCoolingCWC_UseFlowRateVisible = false;
    returnInfo.divCoolingCWC_FlowRateVisible = false;
  }

  if (intHeatingCompID === ClsID.intCompIdHWC) {
    returnInfo.divHeatingHWC_UseCapVisible = true;
    returnInfo.divHeatingHWC_CapVisible = true;
    returnInfo.divHeatingHWC_UseFlowRateVisible = true;
    returnInfo.divHeatingHWC_FlowRateVisible = true;
  } else {
    returnInfo.divHeatingHWC_UseCapVisible = false;
    returnInfo.divHeatingHWC_CapVisible = false;
    returnInfo.divHeatingHWC_UseFlowRateVisible = false;
    returnInfo.divHeatingHWC_FlowRateVisible = false;
  }

  if (intReheatCompID === ClsID.intCompIdHWC) {
    returnInfo.divReheatHWC_UseCapVisible = true;
    returnInfo.divReheatHWC_CapVisible = true;
    returnInfo.divReheatHWC_UseFlowRateVisible = true;
    returnInfo.divReheatHWC_FlowRateVisible = true;
  } else {
    returnInfo.divReheatHWC_UseCapVisible = false;
    returnInfo.divReheatHWC_CapVisible = false;
    returnInfo.divReheatHWC_UseFlowRateVisible = false;
    returnInfo.divReheatHWC_FlowRateVisible = false;
  }

  return returnInfo;
};

export const getUALInfo = (intUAL: any) => {
  const returnInfo = {
    divOutdoorAirDesignCondVisible: false,
    divReturnAirDesignCondVisible: false,
    divCustomVisible: false,
    divHandingValveVisible: false,
  };

  switch (intUAL) {
    case ClsID.intUAL_Admin:
      returnInfo.divOutdoorAirDesignCondVisible = true;
      returnInfo.divReturnAirDesignCondVisible = true;
      returnInfo.divCustomVisible = true;
      returnInfo.divHandingValveVisible = true;
      break;
    case ClsID.intUAL_IntAdmin:
    case ClsID.intUAL_IntLvl_1:
    case ClsID.intUAL_IntLvl_2:
      returnInfo.divOutdoorAirDesignCondVisible = false;
      returnInfo.divReturnAirDesignCondVisible = false;
      returnInfo.divCustomVisible = true;
      returnInfo.divHandingValveVisible = true;
      break;
    default:
      returnInfo.divOutdoorAirDesignCondVisible = false;
      returnInfo.divReturnAirDesignCondVisible = false;
      returnInfo.divCustomVisible = false;
      returnInfo.divHandingValveVisible = false;
      break;
  }

  return returnInfo;
};

export const getHeatPumpInfo = (intCoolingCompID: any) => {
  const returnInfo = {
    ckbHeatPumpVal: false,
    divHeatPumpVisible: false,
    ckbHeatPumpChecked: false,
  };

  if (intCoolingCompID === ClsID.intCompIdCWC) {
    returnInfo.ckbHeatPumpVal = false;
    returnInfo.divHeatPumpVisible = false;
  } else if (intCoolingCompID === ClsID.intCompIdDX) {
    returnInfo.ckbHeatPumpVal = true;
    returnInfo.divHeatPumpVisible = true;
  } else {
    returnInfo.ckbHeatPumpVal = false;
    returnInfo.divHeatPumpVisible = false;
  }

  return returnInfo;
};

export const getDehumidificationInfo = (intCoolingCompID: any) => {
  const returnInfo = {
    divDehumidificationVisible: false,
    ckbDehumidification: 0,
    ckbDehumidificationChecked: 0,
  };
  if (intCoolingCompID === ClsID.intCompIdCWC || intCoolingCompID === ClsID.intCompIdDX) {
    returnInfo.divDehumidificationVisible = true;
  } else {
    returnInfo.divDehumidificationVisible = false;
    returnInfo.ckbDehumidification = 0;
    returnInfo.ckbDehumidificationChecked = 0;
  }

  returnInfo.ckbDehumidificationChecked = 0;

  return returnInfo;
};

export const getDXCoilRefrigDesignCondInfo = (intUAL: any, intCoolingCompID: any) => {
  const returnInfo = { divDXCoilRefrigDesignCondVisible: false };

  if (
    intUAL === ClsID.intUAL_Admin ||
    intUAL === ClsID.intUAL_IntAdmin ||
    intUAL === ClsID.intUAL_IntLvl_1 ||
    intUAL === ClsID.intUAL_IntLvl_2
  ) {
    returnInfo.divDXCoilRefrigDesignCondVisible = intCoolingCompID === ClsID.intCompIdDX;
  } else {
    returnInfo.divDXCoilRefrigDesignCondVisible = false;
  }

  return returnInfo;
};

export const getHeatElecHeaterInstallationInfo = (
  db: { dbtSelElecHeaterInstallation: any },
  intHeatingCompID: any,
  intReheatCompID: any
) => {
  const returnInfo = {
    ddlHeatElecHeaterInstallationDataTbl: [],
    ddlHeatElecHeaterInstallationId: 0,
  };

  if (
    intHeatingCompID === ClsID.intCompIdElecHeater ||
    intReheatCompID === ClsID.intCompIdElecHeater
  ) {
    returnInfo.ddlHeatElecHeaterInstallationId = 1;

    let dtElecHeaterInstallation = db?.dbtSelElecHeaterInstallation;
    dtElecHeaterInstallation = dtElecHeaterInstallation?.filter(
      (item: { id: number }) => item.id !== 0
    );

    returnInfo.ddlHeatElecHeaterInstallationDataTbl = dtElecHeaterInstallation;
  } else {
    returnInfo.ddlHeatElecHeaterInstallationId = 0;

    let dtElecHeaterInstallation = db?.dbtSelElecHeaterInstallation;
    dtElecHeaterInstallation = dtElecHeaterInstallation?.filter(
      (item: { id: number }) => item.id !== 0
    );

    returnInfo.ddlHeatElecHeaterInstallationDataTbl = dtElecHeaterInstallation;
  }

  return returnInfo;
};

export const getReheatInfo = (
  db: { dbtSelUnitCoolingHeating: any[] },
  ckbDehumidificationVal: any,
  intCoolingCompID: any,
  intUAL: any,
  intUnitTypeID: any,
  intProductTypeID: any,
  intUnitModelID: any
) => {
  const reheatInfo: {
    dtReheatComp: any;
    ddlReheatCompId: number;
    divReheatCompVisible: boolean;
  } = {
    dtReheatComp: undefined,
    ddlReheatCompId: 0,
    divReheatCompVisible: false,
  };
  let dtReheatComp = [];

  if (ckbDehumidificationVal) {
    dtReheatComp = db?.dbtSelUnitCoolingHeating;

    switch (intCoolingCompID) {
      case ClsID.intCompIdCWC:
        dtReheatComp = dtReheatComp?.filter(
          (item: { id: { toString: () => any } }) => item.id.toString() !== ClsID.intCompIdHGRH.toString()
        );
        break;
      case ClsID.intCompIdDX:
        if (
          intUAL === ClsID.intUAL_External &&
          (intUnitTypeID === ClsID.intUnitTypeIdERV || intUnitTypeID === ClsID.intUnitTypeIdHRV)
        ) {
          dtReheatComp = dtReheatComp?.filter(
            (item: { id: { toString: () => any } }) => item.id.toString() !== ClsID.intCompIdHGRH.toString()
          );
        } else if (
          intProductTypeID === ClsID.intProdTypeIdVentum &&
          (intUnitModelID === ClsID.intVentumUnitModelIdH05IN_ERV_HRV ||
            intUnitModelID === ClsID.intVentumUnitModelIdH05IN_ERV_HRV_BP)
        ) {
          dtReheatComp = dtReheatComp?.filter(
            (item: { id: { toString: () => any } }) =>  item.id.toString() !== ClsID.intCompIdHGRH.toString()
          );
        }
        break;
      default:
        break;
    }

    switch (intUnitTypeID) {
      case ClsID.intUnitTypeIdERV:
        dtReheatComp = dtReheatComp?.filter((e: { erv_reheat: any }) => Number(e.erv_reheat) === 1) || [];
        break;
      case ClsID.intUnitTypeIdHRV:
        dtReheatComp =  dtReheatComp?.filter((e: { hrv_reheat: any }) => Number(e.hrv_reheat) === 1) || [];
        break;
      case ClsID.intUnitTypeIdAHU:
        dtReheatComp = dtReheatComp?.filter((e: { fc_reheat: any }) => Number(e.fc_reheat) === 1) || [];
        break;
      default:
        // code block
        break;
    }

    reheatInfo.dtReheatComp = dtReheatComp;
    reheatInfo.ddlReheatCompId = dtReheatComp?.[0]?.id;
    reheatInfo.divReheatCompVisible = true;
  } else {
    dtReheatComp = db?.dbtSelUnitCoolingHeating;
    reheatInfo.dtReheatComp = dtReheatComp;
    reheatInfo.ddlReheatCompId = ClsID.intCompIdNA;
    reheatInfo.divReheatCompVisible = false;
  }

  return reheatInfo;
};

// export const getHeatingFluidTypeInfo = (
//   data: { fluidType: any; fluidConcentration: any },
//   intPreheatCompID: any,
//   intHeatingCompID: any,
//   intReheatCompID: any
// ) => {
//   const returnInfo: {
//     isVisible?: boolean;
//     dataTable?: any;
//     defaultId?: number;
//     // FluidConcenData?: any;
//     // FluidConcenId?: number;
//   } = {};

//   returnInfo.isVisible = !!(
//     intPreheatCompID === ClsID.intCompHWC_ID ||
//     intHeatingCompID === ClsID.intCompHWC_ID ||
//     intReheatCompID === ClsID.intCompHWC_ID
//   );

//   let dataTableSel = data?.fluidType;
//   dataTableSel = dataTableSel?.filter((item: { id: number }) => item.id !== 1);
  
//   returnInfo.dataTable = dataTableSel;
//   returnInfo.defaultId = returnInfo.dataTable?.[0]?.id;
//   // returnInfo.FluidConcenData = getItemsAddedOnIDDataTable(data?.fluidConcentration,'fluid_type_id',returnInfo.FluidTypeId || 0);
//   // returnInfo.FluidConcenId = returnInfo.FluidConcenData?.[0]?.id;

//   return returnInfo;
// };


// export const getHeatingFluidConcenInfo = (
//   data: { fluidConcentration: any },
//   FluidTypeId: any,
// ) => {
//   const returnInfo: {
//     isVisible?: boolean;
//     dataTable?: any;
//     defaultId?: number;
//   } = {};

//   let dataTableSel = data?.fluidConcentration;
//   // DataSel = DataSel?.filter((item: { id: number }) => item.id !== 1);

//   // dataTableSel = getItemsAddedOnIDDataTable(dataTableSel,'fluid_type_id', FluidTypeId || 0);
//   dataTableSel = dataTableSel?.filter((item: { fluid_type_id: number }) => item.fluid_type_id === FluidTypeId);

//   returnInfo.dataTable = dataTableSel;
//   returnInfo.defaultId = dataTableSel?.[0]?.id;

//   return returnInfo;
// };



// export const getCoolingFluidTypeInfo = (
//   db: { dbtSelFluidType: any; dbtSelFluidConcentration: any },
//   intCoolingCompID: any,
// ) => {
//   const returnInfo: {
//     isVisible?: boolean;
//     dataTable?: any;
//     defaultId?: number;
//     // FluidConcenData?: any;
//     // FluidConcenId?: number;
//   } = {};

//   // returnInfo.divHeatingFluidDesignCondVisible = !!(
//   //   intPreheatCompID === ClsID.intCompHWC_ID ||
//   //   intHeatingCompID === ClsID.intCompHWC_ID ||
//   //   intReheatCompID === ClsID.intCompHWC_ID
//   // );

//   let dataTableSel = db?.dbtSelFluidType;
//   dataTableSel = dataTableSel?.filter((item: { id: number }) => item.id !== 1);
  
//   returnInfo.dataTable = dataTableSel;
//   returnInfo.defaultId = dataTableSel?.[0]?.id;
//   // returnInfo.FluidConcenData = getItemsAddedOnIDDataTable(data?.fluidConcentration,'fluid_type_id',returnInfo.FluidTypeId || 0);
//   // returnInfo.FluidConcenId = returnInfo.FluidConcenData?.[0]?.id;

//   return returnInfo;
// };


// export const getCoolingFluidConcenInfo = (
//   db: { dbtSelFluidConcentration: any },
//   FluidTypeId: any,
// ) => {
//   const returnInfo: {
//     isVisible?: boolean;
//     dataTable?: any;
//     defaultId?: number;
//   } = {};

//   let dataTableSel = db?.dbtSelFluidConcentration;
//   // DataSel = DataSel?.filter((item: { id: number }) => item.id !== 1);

//   // dataTableSel = getItemsAddedOnIDDataTable(dataTableSel,'fluid_type_id', FluidTypeId || 0);
//   dataTableSel = dataTableSel?.filter((item: { fluid_type_id: number }) => item.fluid_type_id === FluidTypeId);

//   returnInfo.dataTable = dataTableSel;
//   returnInfo.defaultId = dataTableSel?.[0]?.id;

//   return returnInfo;
// };

export const getDamperAndActuatorInfo = (
  db: { dbtSelDamperActuator: any },
  intProductTypeID: any,
  intLocationID: any
) => {
  const returnInfo: {
    ddlDamperAndActuatorDataTbl?: any;
    ddlDamperAndActuatorId?: number;
    divDamperAndActuatorVisible?: boolean;
  } = {};

  let dtDamperAndAct = db?.dbtSelDamperActuator;

  switch (intProductTypeID) {
    case ClsID.intProdTypeIdNova:
    case ClsID.intProdTypeIdVentum:
    case ClsID.intProdTypeIdVentumLite:
    case ClsID.intProdTypeIdTerra:
      dtDamperAndAct = dtDamperAndAct?.filter((item: { std_selection: number }) => item.std_selection === 1);
      break;
    case ClsID.intProdTypeIdVentumPlus:
      dtDamperAndAct = dtDamperAndAct?.filter((item: { ventumplus: number }) => item.ventumplus === 1);
      break;
    default:
      break;
  }

  returnInfo.ddlDamperAndActuatorDataTbl = dtDamperAndAct;
  returnInfo.ddlDamperAndActuatorId = dtDamperAndAct?.[0]?.id;

  if (intLocationID === ClsID.intLocationIdOutdoor) {
    switch (intProductTypeID) {
      case ClsID.intProdTypeIdNova:
      case ClsID.intProdTypeIdVentum:
      case ClsID.intProdTypeIdVentumLite:
      case ClsID.intProdTypeIdTerra:
        returnInfo.ddlDamperAndActuatorId = ClsID.intDamperActIdFieldInstAndWired;
        break;
      case ClsID.intProdTypeIdVentumPlus:
        returnInfo.ddlDamperAndActuatorId = ClsID.intDamperActIdFactMountedAndWired;
        break;
      default:
        break;
    }

    returnInfo.divDamperAndActuatorVisible = false;
  } else {
    returnInfo.divDamperAndActuatorVisible = true;
  }

  return returnInfo;
};

const getDdlLockItem = (dt: any[], id: any) => {
  const temp = dt?.filter((item: { id: any }) => item.id === id);
  if (temp?.length > 0) {
    return id;
  }

  return dt[0].id;
};

export const getElecHeaterVoltageInfo = (
  db: { dbtSelElectricalVoltage: any[] },
  intPreheatCompID: any,
  intHeatingCompID: any,
  intReheatCompID: any,
  intProductTypeID: any,
  intUnitModelID: any,
  intElecHeaterVoltageID: any,
  intUnitVoltageID: any,
  ckbVoltageSPPVal: any,
  strUnitModelValue: any
) => {
  const returnInfo: {
    ddlElecHeaterVoltageDataTbl: any[];
    divElecHeaterVoltageVisible: boolean;
    ddlElecHeaterVoltageId: number;
    ddlElecHeaterVoltageEnabled: boolean;
  } = {
    divElecHeaterVoltageVisible: false,
    ddlElecHeaterVoltageId: 0,
    ddlElecHeaterVoltageEnabled: false,
    ddlElecHeaterVoltageDataTbl: [],
  };

  let dtElecHeaterVoltage = [];
  let intSelectedValue = intUnitVoltageID;
  let visibled = true;
  let enabled = true;

  if (
    intPreheatCompID === ClsID.intCompIdElecHeater ||
    intHeatingCompID === ClsID.intCompIdElecHeater ||
    intReheatCompID === ClsID.intCompIdElecHeater
  ) {
    returnInfo.divElecHeaterVoltageVisible = true;

    let bol208V_1Ph = false;
    // intProdTypeNovaID
    if (intProductTypeID === ClsID.intProdTypeIdNova) {
      if (intUnitModelID) {
        dtElecHeaterVoltage = db?.dbtSelElectricalVoltage;
        // const dtLink = data?.novaElecHeatVoltageLink.filter((x) => x.unit_model_value === strUnitModelValue);

        if (intUnitVoltageID) {
          intSelectedValue = intUnitModelID;
        }

        // dtElecHeaterVoltage = dtElecHeaterVoltage.map(
        //   (item) => dtLink.filter((el) => el.voltage_id === item.id)?.length > 0
        // );
      }
      // intProdTypeVentumID
    } else if (intProductTypeID === ClsID.intProdTypeIdVentum) {
      if (
        intUnitModelID === ClsID.intVentumUnitModelIdH05IN_ERV_HRV ||
        intUnitModelID === ClsID.intVentumUnitModelIdH10IN_ERV_HRV ||
        intUnitModelID === ClsID.intVentumUnitModelIdH05IN_ERV_HRV_BP ||
        intUnitModelID === ClsID.intVentumUnitModelIdH10IN_ERV_HRV_BP
      ) {
        bol208V_1Ph = true;
        dtElecHeaterVoltage = db?.dbtSelElectricalVoltage?.filter(
          (item: { electric_heater_2: number; id: any }) =>
            item.electric_heater_2 === 1 || item.id === intElecHeaterVoltageID
        );
      } else {
        dtElecHeaterVoltage = db?.dbtSelElectricalVoltage?.filter(
          (item: { electric_heater: number; id: any }) =>
            item.electric_heater === 1 || item.id === intElecHeaterVoltageID
        );
      }

      if (bol208V_1Ph) {
        returnInfo.ddlElecHeaterVoltageId = ClsID.intElectricVoltageId208V_1Ph_60Hz;
        enabled = false;
      } else {
        returnInfo.ddlElecHeaterVoltageId = ClsID.intElectricVoltageId208V_3Ph_60Hz;
      }

      if (ckbVoltageSPPVal) {
        returnInfo.ddlElecHeaterVoltageEnabled = false;
      } else {
        returnInfo.ddlElecHeaterVoltageEnabled = true;
      }
      // intProdTypeVentumLiteID
    } else if (intProductTypeID === ClsID.intProdTypeIdVentumLite) {
      bol208V_1Ph = true;
      dtElecHeaterVoltage = db?.dbtSelElectricalVoltage?.filter(
        (item: { electric_heater_3: number; id: any }) =>
          item.electric_heater_3 === 1 || item.id === intElecHeaterVoltageID
      );

      if (dtElecHeaterVoltage?.length > 0) {
        if (bol208V_1Ph) {
          intSelectedValue = ClsID.intElectricVoltageId208V_1Ph_60Hz;
        } else {
          intSelectedValue = ClsID.intElectricVoltageId208V_3Ph_60Hz;
        }
      }
      // intProdTypeVentumPlusID
    } else if (intProductTypeID === ClsID.intProdTypeIdVentumPlus) {
      dtElecHeaterVoltage = db?.dbtSelElectricalVoltage?.filter(
        (item: { ventumplus_elec_heater: number; id: any }) =>
          item.ventumplus_elec_heater === 1 || item.id === intElecHeaterVoltageID
      );

      if (ckbVoltageSPPVal) {
        intSelectedValue = getDdlLockItem(dtElecHeaterVoltage, intUnitVoltageID);
        visibled = false;
        enabled = false;
      } else {
        enabled = true;
      }

      if (dtElecHeaterVoltage?.length > 0) {
        if (bol208V_1Ph) {
          intSelectedValue = ClsID.intElectricVoltageId208V_1Ph_60Hz;
        } else {
          intSelectedValue = ClsID.intElectricVoltageId208V_3Ph_60Hz;
        }
      }
      // intProdTypeTerraID
    } else if (intProductTypeID === ClsID.intProdTypeIdTerra) {
      if (ckbVoltageSPPVal) {
        dtElecHeaterVoltage = db?.dbtSelElectricalVoltage?.filter(
          (item: { terra_spp: number; id: any }) =>
            item.terra_spp === 1 || item.id === intElecHeaterVoltageID
        );
        intSelectedValue = getDdlLockItem(dtElecHeaterVoltage, intUnitVoltageID);
        enabled = false;
      } else {
        dtElecHeaterVoltage = db?.dbtSelElectricalVoltage?.filter(
          (item: { terra_non_spp: number; id: any }) =>
            item.terra_non_spp === 1 || item.id === intElecHeaterVoltageID
        );
        enabled = true;
      }

      if (dtElecHeaterVoltage?.length > 0) {
        if (bol208V_1Ph) {
          intSelectedValue = ClsID.intElectricVoltageId208V_1Ph_60Hz;
        } else {
          intSelectedValue = ClsID.intElectricVoltageId208V_3Ph_60Hz;
        }
      }
    }
    if (
      intPreheatCompID === ClsID.intCompIdAuto &&
      intHeatingCompID !== ClsID.intCompIdElecHeater &&
      intReheatCompID !== ClsID.intCompIdElecHeater
    ) {
      visibled = false;
    }
  } else {
    if (intProductTypeID === ClsID.intProdTypeIdVentumLite) {
      dtElecHeaterVoltage = db?.dbtSelElectricalVoltage?.filter(
        (item: { electric_heater_3: number; id: any }) =>
          item.electric_heater_3 === 1 || item.id === intElecHeaterVoltageID
      );
      intSelectedValue = intUnitVoltageID;
      enabled = false;
    } else if (intProductTypeID === ClsID.intProdTypeIdTerra && ckbVoltageSPPVal) {
      dtElecHeaterVoltage = db?.dbtSelElectricalVoltage?.filter(
        (item: { terra_spp: number; id: any }) =>
          item.terra_spp === 1 || item.id === intElecHeaterVoltageID
      );
      intSelectedValue = getDdlLockItem(dtElecHeaterVoltage, intUnitVoltageID);
      enabled = false;
    } else if (
      intProductTypeID === ClsID.intProdTypeIdVentumPlus &&
      (ckbVoltageSPPVal || intPreheatCompID === ClsID.intCompIdAuto)
    ) {
      dtElecHeaterVoltage = db?.dbtSelElectricalVoltage?.filter(
        (item: { ventumplus_elec_heater: number; id: any }) =>
          item.ventumplus_elec_heater === 1 || item.id === intElecHeaterVoltageID
      );
      intSelectedValue = getDdlLockItem(dtElecHeaterVoltage, intUnitVoltageID);
      enabled = false;
    } else {
      dtElecHeaterVoltage = db?.dbtSelElectricalVoltage?.filter(
        (item: { electric_heater: number; id: any }) =>
          item.electric_heater === 1 || item.id === intElecHeaterVoltageID
      );
      intSelectedValue = ClsID.intElectricVoltageId208V_3Ph_60Hz;
    }

    visibled = false;
  }

  returnInfo.ddlElecHeaterVoltageDataTbl = dtElecHeaterVoltage;
  returnInfo.ddlElecHeaterVoltageId = intSelectedValue;
  returnInfo.ddlElecHeaterVoltageEnabled = enabled;
  returnInfo.divElecHeaterVoltageVisible = visibled;

  return returnInfo;
};

export const getValveAndActuatorInfo = (
  intCoolingCompID: any,
  intPreheatCompID: any,
  intHeatingCompID: any,
  intReheatCompID: any
) => {
  const valveAndActuator: {
    divValveAndActuatorVisible: boolean;
    ckbValveAndActuatorVal: number;
    divValveTypeVisible: boolean;
  } = {
    divValveAndActuatorVisible: false,
    ckbValveAndActuatorVal: 0,
    divValveTypeVisible: false,
  };

  if (
    intCoolingCompID === ClsID.intCompIdCWC ||
    intPreheatCompID === ClsID.intCompIdHWC ||
    intHeatingCompID === ClsID.intCompIdHWC ||
    intReheatCompID === ClsID.intCompIdHWC
  ) {
    valveAndActuator.divValveAndActuatorVisible = true;
    valveAndActuator.ckbValveAndActuatorVal = 1;
    valveAndActuator.divValveTypeVisible = true;
  } else {
    valveAndActuator.divValveAndActuatorVisible = false;
    valveAndActuator.ckbValveAndActuatorVal = 0;
    valveAndActuator.divValveTypeVisible = false;
  }

  return valveAndActuator;
};

export const getDrainPanInfo = (intProductTypeID: any, intUnitTypeID: any) => {
  const returnInfo: {
    divDrainPanVisible: boolean;
    ckbDrainPanVal: number;
  } = {
    divDrainPanVisible: false,
    ckbDrainPanVal: 0,
  };

  if (intProductTypeID === ClsID.intProdTypeIdNova) {
    returnInfo.divDrainPanVisible = false;
    returnInfo.ckbDrainPanVal = 0;
  } else if (
    intProductTypeID === ClsID.intProdTypeIdVentum ||
    intProductTypeID === ClsID.intProdTypeIdVentumLite ||
    intProductTypeID === ClsID.intProdTypeIdVentumPlus
  ) {
    if (intUnitTypeID === ClsID.intUnitTypeIdERV) {
      returnInfo.divDrainPanVisible = false;
      returnInfo.ckbDrainPanVal = 0;
    } else if (intUnitTypeID === ClsID.intUnitTypeIdHRV) {
      returnInfo.divDrainPanVisible = true;
      returnInfo.ckbDrainPanVal = 1;
    }
  }

  return returnInfo;
};

export const getHandingInfo = (db: { dbtSelHanding: any }) => {
  const returnInfo: {
    ddlHandingDataTbl: any;
    ddlHandingId: number;
  } = {
    ddlHandingDataTbl: undefined,
    ddlHandingId: 0,
  };

  returnInfo.ddlHandingDataTbl = db?.dbtSelHanding;
  returnInfo.ddlHandingId = returnInfo.ddlHandingDataTbl?.[0]?.id;

  return returnInfo;
};

const isContain = (_dt: string | any[], _strColumn: string, value: any) => {
  for (let i = 0; i < _dt?.length; i += 1) {
    if (_dt[i][_strColumn].toString() === value) return true;
  }

  return false;
};

export const getSupplyAirOpeningInfo = (
  db: { 
    dbtSelOrientOpeningsERV_SA_Link: any,
    dbtSelOpeningsERV_SA: any,
    dbtSelOpeningsFC_SA: any
  },
  intUnitTypeID: any,
  intProductTypeID: any,
  intLocationID: any,
  intOrientationID: any,
  intSupplyAirOpeningId: any,
  strSupplyAirOpening: any,
  intCoolingCompID: number,
  intHeatingCompID: number,
  intReheatCompID: number
) => {
  const returnInfo: {
    ddlSupplyAirOpeningDataTbl: any;
    ddlSupplyAirOpeningId: number;
    ddlSupplyAirOpeningText: string;
  } = {
    ddlSupplyAirOpeningDataTbl: undefined,
    ddlSupplyAirOpeningId: 0,
    ddlSupplyAirOpeningText: '',
  };

  const dtOriOpeningERV_SA_Link = db?.dbtSelOrientOpeningsERV_SA_Link;
  let dtOpeningERV_SA = db?.dbtSelOpeningsERV_SA;
  const dtOpeningFC_SA = db?.dbtSelOpeningsFC_SA;
  let dtLink: any[] = [];
  let dtSelectionTable = [];
  let dtSelectionFinalTable: any = [];

  if (intUnitTypeID === ClsID.intUnitTypeIdERV || intUnitTypeID === ClsID.intUnitTypeIdHRV) {
    // dtLink = data?.oriOpeningERV_SA_Link?.filter((item: { prod_type_id: number }) => item.prod_type_id === Number(intProductTypeID));
    // dtLink = dtLink?.filter((item: { location_id: number }) => item.location_id === Number(intLocationID));
    // dtLink = dtLink?.filter((item: { orientation_id: number }) => item.orientation_id === Number(intOrientationID));

    // dtLink = dtOriOpeningERV_SA_Link?.filter((item: { prod_type_id: number, location_id: number,orientation_id: number }) => item.prod_type_id === Number(intProductTypeID) &&
    //                                                       item.location_id === Number(intLocationID) &&
    //                                                       item.orientation_id === Number(intOrientationID));
    
    dtLink = dtOriOpeningERV_SA_Link?.filter((item: { prod_type_id: number }) => item.prod_type_id === Number(intProductTypeID))
    dtLink = dtLink?.filter((item: { location_id: number }) => item.location_id === Number(intLocationID))
    dtLink = dtLink?.filter((item: { orientation_id: number }) => item.orientation_id === Number(intOrientationID))
                                                  

    // dtSelectionTable = data?.openingERV_SA;
    // dtSelectionTable = dtSelectionTable?.filter((item: { prod_type_id: number }) => item.prod_type_id === Number(intProductTypeID));
   
    dtOpeningERV_SA = dtOpeningERV_SA?.filter((item: { prod_type_id: number })  => item.prod_type_id === Number(intProductTypeID));

    dtSelectionFinalTable = dtOpeningERV_SA?.filter((e: { items: any }) =>
        dtLink?.filter((e_link) => e.items === e_link.openings_sa)?.length === 1 // 1: Matching items, 0: Not matching items
    );

  //   dtSelectionFinalTable = dtSelectionTable?.filter(e =>
  //     dtLink?.filter((e_link) => e.items === e_link.openings_sa)?.length === 1 // 1: Matching items, 0: Not matching items
  // );

    returnInfo.ddlSupplyAirOpeningDataTbl = dtSelectionFinalTable;

    if (intOrientationID === ClsID.intOrientationIdVertical && (intCoolingCompID > 1 || intHeatingCompID > 1 || intReheatCompID > 1)) {
      returnInfo.ddlSupplyAirOpeningId = ClsID.intSA_OpenId2;
    }

    if (isContain(dtSelectionFinalTable, 'items', strSupplyAirOpening)) {
      returnInfo.ddlSupplyAirOpeningId = intSupplyAirOpeningId;
      returnInfo.ddlSupplyAirOpeningText = strSupplyAirOpening;
    } else {
      returnInfo.ddlSupplyAirOpeningId = dtSelectionFinalTable?.[0]?.id;
      returnInfo.ddlSupplyAirOpeningText = dtSelectionFinalTable?.[0]?.items.toString();
    }
  } else if (intUnitTypeID === ClsID.intUnitTypeIdAHU) {
    dtSelectionTable = db?.dbtSelOpeningsFC_SA;

    returnInfo.ddlSupplyAirOpeningDataTbl = dtSelectionTable;
    if (isContain(dtSelectionFinalTable, 'items', strSupplyAirOpening)) {
      returnInfo.ddlSupplyAirOpeningId = intSupplyAirOpeningId;
      returnInfo.ddlSupplyAirOpeningText = strSupplyAirOpening;
    } else {
      returnInfo.ddlSupplyAirOpeningId = dtSelectionFinalTable?.[0]?.id;
      returnInfo.ddlSupplyAirOpeningText = dtSelectionFinalTable?.[0]?.items.toString();
    }
  }

  return returnInfo;
};

export const getRemainingOpeningsInfo = (
  db: {
    dbtSelOpeningsERV_SA_EA_Link: any,
    dbtSelOpeningsERV_EA: any,
    dbtSelOpeningsERV_SA_OA_Link: any,
    dbtSelOpeningsERV_OA: any,
    dbtSelOpeningsERV_SA_RA_Link: any,
    dbtSelOpeningsERV_RA: any,
    dbtSelOpeningsFC_OA: any,
  },
  intUnitTypeID: any,
  intProductTypeID: any,
  strSupplyAirOpening: any,
  intOrientationID: any
) => {
  const returnInfo: {
    ddlExhaustAirOpeningDataTbl: any;
    ddlExhaustAirOpeningId: number;
    ddlExhaustAirOpeningText: string;
    ddlExhaustAirOpeningVisible: boolean;
    ddlOutdoorAirOpeningDataTbl: any;
    ddlOutdoorAirOpeningId: number;
    ddlOutdoorAirOpeningText: string;
    ddlReturnAirOpeningDataTbl: any;
    ddlReturnAirOpeningId: number;
    ddlReturnAirOpeningText: string;
    ddlReturnAirOpeningVisible: boolean;
  } = {
    ddlExhaustAirOpeningDataTbl: undefined,
    ddlExhaustAirOpeningId: 0,
    ddlExhaustAirOpeningText: '',
    ddlExhaustAirOpeningVisible: false,
    ddlOutdoorAirOpeningDataTbl: undefined,
    ddlOutdoorAirOpeningId: 0,
    ddlOutdoorAirOpeningText: '',
    ddlReturnAirOpeningDataTbl: undefined,
    ddlReturnAirOpeningId: 0,
    ddlReturnAirOpeningText: '',
    ddlReturnAirOpeningVisible: false,
  };

  // let dtOpeningERV_EA = data?.openingERV_EA;
  // let dtOpeningERV_SA_OA_Link = data?.openingERV_SA_OA_Link;
  // let dtOpeningERV_OA = data?.openingERV_OA;
  // let dtOpeningERV_SA_RA_Link = data?.openingERV_SA_RA_Link;
  // let dtOpeningERV_RA = data?.openingERV_RA;
  const dtOpeningsFC_OA = db?.dbtSelOpeningsFC_OA
  let dtLink: any[] = [];
  let dtSelectionTable = [];
  let dtSelectionFinalTable = [];

  if (intUnitTypeID === ClsID.intUnitTypeIdERV || intUnitTypeID === ClsID.intUnitTypeIdHRV) {
    // dtLink = data?.openingERV_SA_EA_Link?.filter((item: { prod_type_id: any }) => item.prod_type_id === intProductTypeID);  
    // dtLink = dtLink?.filter((item: { openings_sa: any }) => item.openings_sa === strSupplyAirOpening);
    // dtLink1 = dtLink?.filter((item: { orientation_id: number }) => item.orientation_id === Number(intOrientationID));

    const dtOpeningsERV_SA_EA_Link = db?.dbtSelOpeningsERV_SA_EA_Link;
    dtLink = dtOpeningsERV_SA_EA_Link?.filter((item: { prod_type_id: number }) => item.prod_type_id === Number(intProductTypeID));
    dtLink = dtLink?.filter((item: { openings_sa: any }) => item.openings_sa === strSupplyAirOpening);
    dtLink = dtLink?.filter((item: { orientation_id: number }) => item.orientation_id === Number(intOrientationID));  


    // dtSelectionTable = data?.openingERV_EA;
    // dtSelectionTable = dtSelectionTable?.filter((item: { prod_type_id: number }) => item.prod_type_id === Number(intProductTypeID));
  
    dtSelectionTable = db?.dbtSelOpeningsERV_EA?.filter((item: { prod_type_id: number }) => item.prod_type_id === Number(intProductTypeID));

    dtSelectionFinalTable = dtSelectionTable?.filter((e: { items: any }) =>
        dtLink?.filter((e_link) => e.items === e_link.openings_ea)?.length === 1 // 1: Matching items, 0: Not matching items
    );

    returnInfo.ddlExhaustAirOpeningDataTbl = dtSelectionFinalTable;
    returnInfo.ddlExhaustAirOpeningId = dtSelectionFinalTable[0]?.id;
    returnInfo.ddlExhaustAirOpeningText = dtSelectionFinalTable[0]?.items;
    returnInfo.ddlExhaustAirOpeningVisible = true;

    // dtLink = data?.openingERV_SA_OA_Link?.filter((item: { prod_type_id: any }) => item.prod_type_id === intProductTypeID);
    // dtLink = dtLink?.filter((item: { openings_sa: any }) => item.openings_sa === strSupplyAirOpening);
    // dtLink = dtLink?.filter((item: { orientation_id: any }) => item.orientation_id === intOrientationID);
 
    const dtOpeningsERV_SA_OA_Link = db?.dbtSelOpeningsERV_SA_OA_Link;
    dtLink = dtOpeningsERV_SA_OA_Link?.filter((item: { prod_type_id: number }) => item.prod_type_id === intProductTypeID);
    dtLink = dtLink?.filter((item: { openings_sa: any }) => item.openings_sa === strSupplyAirOpening);
    dtLink = dtLink?.filter((item: { orientation_id: number }) => item.orientation_id === intOrientationID);

    // dtSelectionTable = data?.openingERV_OA;
    // dtSelectionTable = dtSelectionTable?.filter((item: { prod_type_id: number }) => item.prod_type_id === Number(intProductTypeID));
    
    const dtOpeningsERV_OA = db?.dbtSelOpeningsERV_OA;
    dtSelectionTable = dtOpeningsERV_OA?.filter((item: { prod_type_id: number }) => item.prod_type_id === Number(intProductTypeID));

    dtSelectionFinalTable = dtSelectionTable?.filter((e: { items: any }) =>
        dtLink?.filter((e_link) => e.items === e_link.openings_oa)?.length === 1 // 1: Matching items, 0: Not matching items
    );

    returnInfo.ddlOutdoorAirOpeningDataTbl = dtSelectionFinalTable;
    returnInfo.ddlOutdoorAirOpeningId = dtSelectionFinalTable[0]?.id;
    returnInfo.ddlOutdoorAirOpeningText = dtSelectionFinalTable[0]?.items;

    // dtLink = data?.openingERV_SA_RA_Link?.filter((item: { prod_type_id: any }) => item.prod_type_id === intProductTypeID);
    // dtLink = dtLink?.filter((item: { openings_sa: any }) => item.openings_sa === strSupplyAirOpening);
    // dtLink = dtLink?.filter((item: { orientation_id: number }) => item.orientation_id === Number(intOrientationID));

    // dtLink = data?.openingERV_SA_RA_Link?.filter(item => item.prod_type_id === intProductTypeID &&
    //   item.openings_sa === strSupplyAirOpening &&
    //   item.orientation_id === Number(intOrientationID));

    const dtOpeningsERV_SA_RA_Link = db?.dbtSelOpeningsERV_SA_RA_Link;
    dtLink = dtOpeningsERV_SA_RA_Link?.filter((item: { prod_type_id: number }) => item.prod_type_id === intProductTypeID);
    dtLink = dtLink?.filter((item: { openings_sa: any }) => item.openings_sa === strSupplyAirOpening);
    dtLink = dtLink?.filter((item: { orientation_id: number }) => item.orientation_id === Number(intOrientationID));


    // dtSelectionTable = data?.openingERV_RA;
    // dtSelectionTable = dtSelectionTable?.filter((item: { prod_type_id: number }) => item.prod_type_id === Number(intProductTypeID));
    
    const dtOpeningsERV_RA = db?.dbtSelOpeningsERV_RA;
    dtSelectionTable = dtOpeningsERV_RA?.filter((item: { prod_type_id: number }) => item.prod_type_id === Number(intProductTypeID));

    dtSelectionFinalTable = dtSelectionTable?.filter((e: { items: any }) =>
        dtLink?.filter((e_link) => e.items === e_link.openings_ra)?.length === 1 // 1: Matching items, 0: Not matching items
    );

    returnInfo.ddlReturnAirOpeningDataTbl = dtSelectionFinalTable;
    returnInfo.ddlReturnAirOpeningId = dtSelectionFinalTable[0]?.id;
    returnInfo.ddlReturnAirOpeningText = dtSelectionFinalTable[0]?.items;
    returnInfo.ddlReturnAirOpeningVisible = true;
  } else if (intUnitTypeID === ClsID.intUnitTypeIdAHU) {
    dtSelectionTable = db?.dbtSelOpeningsFC_OA;

    returnInfo.ddlOutdoorAirOpeningDataTbl = dtSelectionTable;
    returnInfo.ddlOutdoorAirOpeningId = dtSelectionTable[0]?.id;
    returnInfo.ddlOutdoorAirOpeningText = dtSelectionTable[0]?.items;

    dtSelectionTable = [{ id: 0, items: 'NA' }, ...dtSelectionTable];

    returnInfo.ddlExhaustAirOpeningDataTbl = dtSelectionTable;
    returnInfo.ddlExhaustAirOpeningId = 0;
    returnInfo.ddlExhaustAirOpeningText = 'NA';
    returnInfo.ddlExhaustAirOpeningVisible = false;

    returnInfo.ddlReturnAirOpeningDataTbl = dtSelectionTable;
    returnInfo.ddlReturnAirOpeningId = 0;
    returnInfo.ddlReturnAirOpeningText = 'NA';
    returnInfo.ddlReturnAirOpeningVisible = false;
  }

  return returnInfo;
};

export const getOrientation = (
  db: { dbtSelLocOriLink: any[]; dbtSelGeneralOrientation: any },
  intProductTypeID: any,
  intUnitTypeID: any,
  intLocationID: any,
  intSummerSupplyAirCFM: number
) => {
  const dtLocOri = db?.dbtSelLocOriLink?.filter((item: { prod_type_id: any; unit_type_id: any; location_id: any }) => 
                                                                          item.prod_type_id === intProductTypeID &&
                                                                          item.unit_type_id === intUnitTypeID &&
                                                                          item.location_id === intLocationID
  );

  // let dtOrientation = getFromLink(data?.generalOrientation, 'orientation_id', dtLocOri, 'max_cfm');
  let dtOrientation: any = db?.dbtSelGeneralOrientation?.filter((e: { id: any }) => dtLocOri?.filter((e_link: { orientation_id: any}) => e.id === e_link.orientation_id)?.length > 0);
  dtOrientation?.sort((a: any, b: any) => a.max_cfm- b.max_cfm);



  if (intProductTypeID === ClsID.intProdTypeIdNova) {
    dtOrientation = dtOrientation?.filter((item: { max_cfm: any}) => item.max_cfm >= intSummerSupplyAirCFM);
  }

  return dtOrientation?.filter((item: { id: any}) => !!item.id);
};

export const getLocation = (
  db: { dbtSelProdTypeUnitTypeLocLink: any[]; dbtSelGeneralLocation: any[] },
  intProductTypeID: number,
  intUnitTypeID: number
) => {
  const dtProdUnitLocLink = db?.dbtSelProdTypeUnitTypeLocLink?.filter((item: { prod_type_id: any; unit_type_id: any }) =>
      item.prod_type_id === intProductTypeID && item.unit_type_id === intUnitTypeID
  );

  return db?.dbtSelGeneralLocation?.filter((e: { id: any }) =>
     dtProdUnitLocLink?.filter((e_link: { location_id: any }) => e_link.location_id === e.id)?.length > 0
  );
};






export default function Index() {
  return null;
}
