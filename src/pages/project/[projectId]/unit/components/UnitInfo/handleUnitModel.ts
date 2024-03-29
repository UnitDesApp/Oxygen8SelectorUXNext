const ClsID = require('src/utils/ids');

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
const intVENPLUS_INT_USERS_MAX_CFM_NO_BYPASS = 10000;
const intVENPLUS_INT_USERS_MIN_CFM_WITH_BYPASS = 1080;
const intVENPLUS_INT_USERS_MAX_CFM_WITH_BYPASS = 10000;

const intTERA_MIN_CFM_NO_BYPASS = 450;
const intTERA_MAX_CFM_NO_BYPASS = 2400;
const intTERA_MIN_CFM_WITH_BYPASS = 450;
const intTERA_MAX_CFM_WITH_BYPASS = 500;

const intTERA_INT_USERS_MIN_CFM_NO_BYPASS = 400;
const intTERA_INT_USERS_MAX_CFM_NO_BYPASS = 2500;
const intTERA_INT_USERS_MIN_CFM_WITH_BYPASS = 400;
const intTERA_INT_USERS_MAX_CFM_WITH_BYPASS = 2500;

const getFromLink = (dt: any, linkColumn: any, dtLink: any, sortColumn: string) => {
  if (!dt || !dtLink) return [];
  let intID = 0;
  let intLinkID = 0;

  const dtSelected = new Array<{ [key: string]: any }>([]);

  for (let i = 0; i < dt?.length; i += 1) {
    intID = Number(dt[i].id);
    for (let j = 0; j < dtLink?.length; j += 1) {
      intLinkID = Number(dtLink[j][linkColumn]);

      if (intID === intLinkID) {
        const dr: { [key: string]: any } = {};
        dr.id = Number(dt[i].id);
        dr.items = dt[i].items.toString();

        if (sortColumn !== '') {
          dr[sortColumn] = Number(dt[i][sortColumn]);
        }

        dr.bypass_exist = dt[i]?.bypass_exist?.toString();
        dr.bypass_exist_horizontal_unit = dt[i]?.bypass_exist_horizontal_unit?.toString();
        dr.model_bypass = dt[i]?.model_bypass?.toString();

        dtSelected.push(dr);
        break;
      }

      if (intLinkID > intID) {
        break;
      }
    }
  }

  return dtSelected;
};

const sortColume = (data: any, colume: string) =>
  data?.sort((a: any, b: any) => a[colume] - b[colume]);

const unitModelFilter = (data: any, value: any, minColumeName: string, maxColumeName: string) =>
  data
    ?.filter((item: any) => item[minColumeName] <= value && value <= item[maxColumeName])
    .sort((a: any, b: any) => a.cfm_max - b.cfm_max);

export const getUnitModel = (
  data: {
    novaUnitModelLocOriLink: any;
    generalLocation: any[];
    generalOrientation: any[];
    novaUnitModel: any[];
    ventumHUnitModel: {
      filter: (arg0: {
        (item: any): boolean;
        (item: any): boolean;
        (item: any): boolean;
      }) => never[];
    };
    ventumLiteUnitModel: {
      filter: (arg0: {
        (item: any): boolean;
        (item: any): boolean;
        (item: any): boolean;
        (item: any): boolean;
        (item: any): boolean;
      }) => never[];
    };
    ventumPlusUnitModel: any;
    terraUnitModel: { filter: (arg0: { (item: any): boolean; (item: any): boolean }) => never[] };
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
    let unitModelLink;
    let location: {
      value: any;
      id_key: any;
    }[];
    let orientation: { value: { toString: () => any } }[];
    unitModelId = Number.isNaN(unitModelId) ? 0 : unitModelId;

    switch (intProductTypeID) {
      case ClsID.intProdTypeNovaID:
        unitModelLink = data?.novaUnitModelLocOriLink;
        location = data?.generalLocation?.filter((item: { id: any }) => item.id === locationId);
        orientation = data?.generalOrientation?.filter(
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
            data?.novaUnitModel?.filter(
              (item: { cfm_min_ext_users: number; cfm_max_ext_users: number }) =>
                item.cfm_min_ext_users <= summerSupplyAirCFM &&
                item.cfm_max_ext_users >= summerSupplyAirCFM
            ) || [];
        } else {
          // unitModel = unitModelFilter(data?.novaUnitModel, summerSupplyAirCFM, 'cfm_min', 'cfm_max', unitModelId);
          unitModel = data?.novaUnitModel?.filter(
            (item: { cfm_min: number; cfm_max: number }) =>
              item.cfm_min <= summerSupplyAirCFM && item.cfm_max >= summerSupplyAirCFM
          );
        }

        if (intUAL === ClsID.intUAL_External || intUAL === ClsID.intUAL_ExternalSpecial) {
          unitModel = unitModel?.filter(
            (item: { enabled_ext_users: number }) => item.enabled_ext_users === 1
          );
        }

        unitModel = getFromLink(unitModel, 'unit_model_id', unitModelLink, 'cfm_max');
        unitModel = sortColume(unitModel, 'cfm_max');

        if (ckbBypassVal === 1) {
          const drUnitModelBypass = unitModel?.filter(
            (item: { bypass_exist: number }) => item.bypass_exist === 1
          );
          const unitModelBypass = drUnitModelBypass || [];

          if (unitModelBypass?.length > 0) {
            unitModel = unitModel?.filter(
              (item: { bypass_exist: number }) => item.bypass_exist === 1
            );

            if (orientationId === ClsID.intOrientationHorizontalID) {
              const drUnitModelBypassHorUnit = unitModel?.filter(
                (item: { bypass_exist_horizontal_unit: number }) =>
                  item.bypass_exist_horizontal_unit === 1
              );
              const unitModelBypassHorUnit = drUnitModelBypassHorUnit || [];

              if (unitModelBypassHorUnit?.length > 0) {
                unitModel = unitModel?.filter(
                  (item: { bypass_exist_horizontal_unit: number }) =>
                    item.bypass_exist_horizontal_unit === 1
                );
              } else {
                ckbBypassVal = 0;
              }
            }
          }
        }
        break;
      case ClsID.intProdTypeVentumID:
        if (ckbBypassVal === 1) {
          summerSupplyAirCFM =
            summerSupplyAirCFM > intVEN_MAX_CFM_WITH_BYPASS
              ? intVEN_MAX_CFM_WITH_BYPASS
              : summerSupplyAirCFM;
        }

        if (intUAL === ClsID.intUAL_External || intUAL === ClsID.intUAL_ExternalSpecial) {
          if (intUnitTypeID === ClsID.intUnitTypeERV_ID) {
            // unitModel = unitModelFilter(data?.ventumHUnitModel,summerSupplyAirCFM,'erv_cfm_min_ext_users','erv_cfm_max_ext_users',unitModelId);
            unitModel =
              data?.ventumHUnitModel?.filter(
                (item: { erv_cfm_min_ext_users: number; erv_cfm_max_ext_users: number }) =>
                  item.erv_cfm_min_ext_users <= summerSupplyAirCFM &&
                  item.erv_cfm_max_ext_users >= summerSupplyAirCFM
              ) || [];

            unitModel = unitModel.map((item: { model_erv: any }) => ({
              ...item,
              items: item.model_erv,
            }));
          } else if (intUnitTypeID === ClsID.intUnitTypeHRV_ID) {
            // unitModel = unitModelFilter(data?.ventumHUnitModel,summerSupplyAirCFM,'hrv_cfm_min_ext_users','hrv_cfm_max_ext_users', unitModelId);
            unitModel =
              data?.ventumHUnitModel?.filter(
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
            data?.ventumHUnitModel?.filter(
              (item: { cfm_min: number; cfm_max: number }) =>
                item.cfm_min <= summerSupplyAirCFM && item.cfm_max >= summerSupplyAirCFM
            ) || [];
        }

        unitModel = unitModel?.filter((item: { bypass: any }) => item.bypass === ckbBypassVal);

        // getReheatInfo();    //Only for Ventum - H05 has no HGRH option
        break;
      case ClsID.intProdTypeVentumLiteID:
        ckbBypassVal = 0;

        if (intUAL === ClsID.intUAL_IntLvl_1 || intUAL === ClsID.intUAL_IntLvl_2) {
          if (intUnitTypeID === ClsID.intUnitTypeERV_ID) {
            // unitModel = unitModelFilter(data?.ventumLiteUnitModel,summerSupplyAirCFM,'cfm_min','cfm_max', unitModelId);
            unitModel =
              data?.ventumLiteUnitModel?.filter(
                (item: { cfm_min: number; cfm_max: number }) =>
                  item.cfm_min <= summerSupplyAirCFM && item.cfm_max >= summerSupplyAirCFM
              ) || [];

            unitModel = unitModel.map((item: { model_erv: any }) => ({
              ...item,
              items: item.model_erv,
            }));
          } else if (intUnitTypeID === ClsID.intUnitTypeHRV_ID) {
            // unitModel = unitModelFilter(data?.ventumLiteUnitModel,summerSupplyAirCFM,'cfm_min','cfm_max',unitModelId);
            unitModel =
              data?.ventumLiteUnitModel?.filter(
                (item: { cfm_min: number; cfm_max: number }) =>
                  item.cfm_min <= summerSupplyAirCFM && item.cfm_max >= summerSupplyAirCFM
              ) || [];

            unitModel = unitModel.map((item: { model_hrv: any }) => ({
              ...item,
              items: item.model_hrv,
            }));
          }
        } else if (intUAL === ClsID.intUAL_External || intUAL === ClsID.intUAL_ExternalSpecial) {
          if (intUnitTypeID === ClsID.intUnitTypeERV_ID) {
            // unitModel = unitModelFilter(data?.ventumLiteUnitModel,summerSupplyAirCFM,'erv_cfm_min_ext_users','erv_cfm_max_ext_users',unitModelId);
            unitModel =
              data?.ventumLiteUnitModel?.filter(
                (item: { erv_cfm_min_ext_users: number; erv_cfm_max_ext_users: number }) =>
                  item.erv_cfm_min_ext_users <= summerSupplyAirCFM &&
                  item.erv_cfm_max_ext_users >= summerSupplyAirCFM
              ) || [];
            unitModel = unitModel.map((item: { model_erv: any }) => ({
              ...item,
              items: item.model_erv,
            }));
          } else if (intUnitTypeID === ClsID.intUnitTypeHRV_ID) {
            // unitModel = unitModelFilter(data?.ventumLiteUnitModel, summerSupplyAirCFM,'hrv_cfm_min_ext_users','hrv_cfm_max_ext_users',unitModelId);
            unitModel =
              data?.ventumLiteUnitModel?.filter(
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
            data?.ventumLiteUnitModel?.filter(
              (item: { cfm_min: number; cfm_max: number }) =>
                item.cfm_min <= summerSupplyAirCFM && item.cfm_max >= summerSupplyAirCFM
            ) || [];
        }

        unitModel = unitModel?.filter(
          (item: { enabled: number; bypass: any }) =>
            item.enabled === 1 && item.bypass === ckbBypassVal
        );
        break;
      case ClsID.intProdTypeVentumPlusID:
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
          if (intUnitTypeID === ClsID.intUnitTypeERV_ID) {
            unitModel = unitModelFilter(
              data?.ventumPlusUnitModel,
              summerSupplyAirCFM,
              'erv_cfm_min_ext_users',
              'erv_cfm_max_ext_users'
            );
            unitModel = unitModel.map((item: { model_erv: any }) => ({
              ...item,
              items: item.model_erv,
            }));
          } else if (intUnitTypeID === ClsID.intUnitTypeHRV_ID) {
            unitModel = unitModelFilter(
              data?.ventumPlusUnitModel,
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
            data?.ventumPlusUnitModel,
            summerSupplyAirCFM,
            'cfm_min',
            'cfm_max'
          );
          unitModel = unitModel.map((item: { items: any; cfm_min: any; cfm_max: any }) => ({
            ...item,
            items: `${item.items} - (${item.cfm_min}-${item.cfm_max} CFM)`,
          }));
        }
        location = data?.generalLocation?.filter((item: { id: any }) => item.id === locationId);
        unitModel = unitModel?.filter(
          (item: { location_id_key: any; enabled: number; bypass: any }) =>
            item.location_id_key === location?.[0]?.id_key &&
            item.enabled === 1 &&
            item.bypass === ckbBypassVal
        );
        break;
      case ClsID.intProdTypeTerraID:
        if (intUAL === ClsID.intUAL_External || intUAL === ClsID.intUAL_ExternalSpecial) {
          // unitModel = unitModelFilter(data?.terraUnitModel,summerSupplyAirCFM,'cfm_min_ext_users','cfm_max_ext_users',unitModelId);
          unitModel =
            data?.terraUnitModel?.filter(
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
            data?.terraUnitModel?.filter(
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
  ckbBypassVal: number
) => {
  let intSummerSupplyAirCFM = Number(summerSupplyAirCFM);
  switch (intProductTypeID) {
    case ClsID.intProdTypeNovaID:
      if (
        intUAL === ClsID.intUAL_Admin ||
        intUAL === ClsID.intUAL_IntAdmin ||
        intUAL === ClsID.intUAL_IntLvl_2 ||
        intUAL === ClsID.intUAL_IntLvl_1
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
    case ClsID.intProdTypeVentumID:
      if (
        intUAL === ClsID.intUAL_Admin ||
        intUAL === ClsID.intUAL_IntAdmin ||
        intUAL === ClsID.intUAL_IntLvl_2 ||
        intUAL === ClsID.intUAL_IntLvl_1
      ) {
        if (ckbBypassVal === 1) {
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
    case ClsID.intProdTypeVentumLiteID:
      if (
        intUAL === ClsID.intUAL_Admin ||
        intUAL === ClsID.intUAL_IntAdmin ||
        intUAL === ClsID.intUAL_IntLvl_2 ||
        intUAL === ClsID.intUAL_IntLvl_1
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
    case ClsID.intProdTypeVentumPlusID:
      if (
        intUAL === ClsID.intUAL_Admin ||
        intUAL === ClsID.intUAL_IntAdmin ||
        intUAL === ClsID.intUAL_IntLvl_2 ||
        intUAL === ClsID.intUAL_IntLvl_1
      ) {
        if (ckbBypassVal === 1) {
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
    case ClsID.intProdTypeTerraID:
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
    ddlOrientationId: any;
    ddlUnitModelId: any;
    intProductTypeID: any;
    ckbBypassVal: any;
    intUnitTypeID: any;
  },
  intUAL: any,
  data: { ventumHUnitModel: any[]; ventumLiteUnitModel: any[]; ventumPlusUnitModel: any[] }
) => {
  const intSummerSupplyAirCFM = Number(values.txbSummerSupplyAirCFM);
  const intOrientationID = Number(values.ddlOrientationId);
  const intUnitModelID = Number(values.ddlUnitModelId);
  const intProductTypeID = Number(values.intProductTypeID);
  const ckbBypassVal = Number(values.ckbBypassVal);
  let intSummerReturnAirCFM = Number(summerReturnAirCFM);
  const intUnitTypeID = Number(values.intUnitTypeID);
  const ckbBypass = Number(values.ckbBypassVal);

  if (
    intOrientationID === ClsID.intOrientationHorizontalID &&
    intSummerSupplyAirCFM > intNOVA_HORIZONTAL_MAX_CFM
  ) {
    intSummerReturnAirCFM = intNOVA_HORIZONTAL_MAX_CFM;
  }

  let dtModel: any = [];
  switch (intProductTypeID) {
    case ClsID.intProdTypeNovaID:
      if (intSummerReturnAirCFM < intNOVA_MIN_CFM) {
        intSummerReturnAirCFM = intNOVA_MIN_CFM;
      } else if (intSummerReturnAirCFM > intNOVA_MAX_CFM) {
        intSummerReturnAirCFM = intNOVA_MAX_CFM;
      }
      break;
    case ClsID.intProdTypeVentumID:
      dtModel = data?.ventumHUnitModel?.filter(
        (item: { id: number }) => item.id === intUnitModelID
      );

      if (
        intUAL === ClsID.intUAL_Admin ||
        intUAL === ClsID.intUAL_IntAdmin ||
        intUAL === ClsID.intUAL_IntLvl_2 ||
        intUAL === ClsID.intUAL_IntLvl_1
      ) {
        if (ckbBypassVal === 1) {
          if (
            intSummerReturnAirCFM <
            Math.max(intSummerSupplyAirCFM * 0.5, intVEN_INT_USERS_MIN_CFM_WITH_BYPASS)
          ) {
            intSummerReturnAirCFM = Number(
              Math.max(intSummerSupplyAirCFM * 0.5, intVEN_INT_USERS_MIN_CFM_WITH_BYPASS)
            );
          } else if (
            intSummerReturnAirCFM >
            Math.min(Number(intSummerSupplyAirCFM) * 2, intVEN_INT_USERS_MAX_CFM_WITH_BYPASS)
          ) {
            intSummerReturnAirCFM = Number(
              Math.min(intSummerSupplyAirCFM * 2, intVEN_INT_USERS_MAX_CFM_WITH_BYPASS)
            );
          }
        } else if (
          intSummerReturnAirCFM <
          Math.max(Number(intSummerSupplyAirCFM) * 0.5, intVEN_INT_USERS_MIN_CFM_NO_BYPASS)
        ) {
          intSummerReturnAirCFM = Number(
            Math.max(intSummerSupplyAirCFM * 0.5, intVEN_INT_USERS_MIN_CFM_NO_BYPASS)
          );
        } else if (
          intSummerReturnAirCFM >
          Math.min(intSummerSupplyAirCFM * 2, intVEN_INT_USERS_MAX_CFM_NO_BYPASS)
        ) {
          intSummerReturnAirCFM = Number(
            Math.min(intSummerSupplyAirCFM * 2, intVEN_INT_USERS_MAX_CFM_NO_BYPASS)
          );
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
    case ClsID.intProdTypeVentumLiteID:
      dtModel = data?.ventumLiteUnitModel?.filter(
        (item: { id: number }) => item.id === intUnitModelID
      );

      if (
        intUAL === ClsID.intUAL_Admin ||
        intUAL === ClsID.intUAL_IntAdmin ||
        intUAL === ClsID.intUAL_IntLvl_2 ||
        intUAL === ClsID.intUAL_IntLvl_1
      ) {
        if (ckbBypassVal === 1) {
          if (
            intSummerReturnAirCFM <
            Math.max(intSummerSupplyAirCFM * 0.5, intVENLITE_INT_USERS_MIN_CFM_WITH_BYPASS)
          ) {
            intSummerReturnAirCFM = Number(
              Math.max(intSummerSupplyAirCFM * 0.5, intVENLITE_INT_USERS_MIN_CFM_WITH_BYPASS)
            );
          } else if (
            intSummerReturnAirCFM >
            Math.min(intSummerSupplyAirCFM * 2, intVENLITE_INT_USERS_MAX_CFM_WITH_BYPASS)
          ) {
            intSummerReturnAirCFM = Number(
              Math.min(intSummerSupplyAirCFM * 2, intVENLITE_INT_USERS_MAX_CFM_WITH_BYPASS)
            );
          }
        } else if (
          intSummerReturnAirCFM <
          Math.max(intSummerSupplyAirCFM * 0.5, intVENLITE_INT_USERS_MIN_CFM_NO_BYPASS)
        ) {
          intSummerReturnAirCFM = Number(
            Math.max(intSummerSupplyAirCFM * 0.5, intVENLITE_INT_USERS_MIN_CFM_NO_BYPASS)
          );
        } else if (
          intSummerReturnAirCFM >
          Math.min(intSummerSupplyAirCFM * 2, intVENLITE_INT_USERS_MAX_CFM_NO_BYPASS)
        ) {
          intSummerReturnAirCFM = Number(
            Math.min(intSummerSupplyAirCFM * 2, intVENLITE_INT_USERS_MAX_CFM_NO_BYPASS)
          );
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
    case ClsID.intProdTypeVentumPlusID:
      dtModel = data?.ventumPlusUnitModel?.filter(
        (item: { id: number }) => item.id === intUnitModelID
      );

      if (
        intUAL === ClsID.intUAL_Admin ||
        intUAL === ClsID.intUAL_IntAdmin ||
        intUAL === ClsID.intUAL_IntLvl_2 ||
        intUAL === ClsID.intUAL_IntLvl_1
      ) {
        if (ckbBypassVal === 1) {
          if (
            intSummerReturnAirCFM <
            Math.max(intSummerSupplyAirCFM * 0.5, intVENPLUS_INT_USERS_MIN_CFM_WITH_BYPASS)
          ) {
            intSummerReturnAirCFM = Number(
              Math.max(intSummerSupplyAirCFM * 0.5, intVENPLUS_INT_USERS_MIN_CFM_WITH_BYPASS)
            );
          } else if (
            intSummerReturnAirCFM >
            Math.min(intSummerSupplyAirCFM * 2, intVENPLUS_INT_USERS_MAX_CFM_WITH_BYPASS)
          ) {
            intSummerReturnAirCFM = Number(
              Math.min(intSummerSupplyAirCFM * 2, intVENPLUS_INT_USERS_MAX_CFM_WITH_BYPASS)
            );
          }
        } else if (
          intSummerReturnAirCFM <
          Math.max(intSummerSupplyAirCFM * 0.5, intVENPLUS_INT_USERS_MIN_CFM_NO_BYPASS)
        ) {
          intSummerReturnAirCFM = Number(
            Math.max(intSummerSupplyAirCFM * 0.5, intVENPLUS_INT_USERS_MIN_CFM_NO_BYPASS)
          );
        } else if (
          intSummerReturnAirCFM >
          Math.min(intSummerSupplyAirCFM * 2, intVENPLUS_INT_USERS_MAX_CFM_NO_BYPASS)
        ) {
          intSummerReturnAirCFM = Number(
            Math.min(intSummerSupplyAirCFM * 2, intVENPLUS_INT_USERS_MAX_CFM_NO_BYPASS)
          );
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

  if (
    (intProductTypeID === ClsID.intProdTypeVentumID ||
      intProductTypeID === ClsID.intProdTypeVentumLiteID ||
      intProductTypeID === ClsID.intProdTypeVentumPlusID) &&
    intUnitTypeID === ClsID.intUnitTypeHRV_ID
  ) {
    if (intSummerReturnAirCFM < intSummerSupplyAirCFM * 0.5) {
      intSummerReturnAirCFM = Math.ceil(intSummerSupplyAirCFM * 0.5);
    } else if (intSummerReturnAirCFM > Number(intSummerSupplyAirCFM) * 2) {
      intSummerReturnAirCFM = Math.ceil(intSummerSupplyAirCFM * 2);
    }
  } else if (
    (intProductTypeID === ClsID.intProdTypeVentumID ||
      intProductTypeID === ClsID.intProdTypeVentumLiteID ||
      intProductTypeID === ClsID.intProdTypeVentumPlusID) &&
    intUnitTypeID === ClsID.intUnitTypeERV_ID
  ) {
    switch (intProductTypeID) {
      case ClsID.intProdTypeVentumID:
        if (
          intUAL === ClsID.intUAL_Admin ||
          intUAL === ClsID.intUAL_IntAdmin ||
          intUAL === ClsID.intUAL_IntLvl_2 ||
          intUAL === ClsID.intUAL_IntLvl_1
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
      case ClsID.intProdTypeVentumLiteID:
        if (
          intUAL === ClsID.intUAL_Admin ||
          intUAL === ClsID.intUAL_IntAdmin ||
          intUAL === ClsID.intUAL_IntLvl_2 ||
          intUAL === ClsID.intUAL_IntLvl_1
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
      case ClsID.intProdTypeVentumPlusID:
        if (
          intUAL === ClsID.intUAL_Admin ||
          intUAL === ClsID.intUAL_IntAdmin ||
          intUAL === ClsID.intUAL_IntLvl_2 ||
          intUAL === ClsID.intUAL_IntLvl_1
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

  if (intProductTypeID === ClsID.intProdTypeNovaID) {
    if (
      intUnitModelID === ClsID.intNovaUnitModelID_A16IN ||
      intUnitModelID === ClsID.intNovaUnitModelID_B20IN ||
      intUnitModelID === ClsID.intNovaUnitModelID_A18OU ||
      intUnitModelID === ClsID.intNovaUnitModelID_B22OU
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

  if (intProductTypeID === ClsID.intProdTypeNovaID) {
    if (
      intUnitModelID === ClsID.intNovaUnitModelID_A16IN ||
      intUnitModelID === ClsID.intNovaUnitModelID_B20IN ||
      intUnitModelID === ClsID.intNovaUnitModelID_A18OU ||
      intUnitModelID === ClsID.intNovaUnitModelID_B22OU
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
  data: { novaUnitModel: any[] },
  intProductTypeID: any,
  intUnitModelID: any,
  intOrientationID: any,
  ckbBypass: number
) => {
  const result = { text: '', enabled: true, checked: ckbBypass };
  if (intProductTypeID === ClsID.intProdTypeNovaID) {
    const dtUnitModel = data?.novaUnitModel?.filter(
      (item: { id: any }) => item.id === intUnitModelID
    );

    if (ckbBypass === 1) {
      result.enabled = true;
      result.text = '';
    } else {
      result.checked = 0;
      result.enabled = false;

      if (
        intUnitModelID === ClsID.intNovaUnitModelID_C70IN ||
        intUnitModelID === ClsID.intNovaUnitModelID_C70OU
      ) {
        result.text = ' Contact Oxygen8 applications for Bypass model';
      } else {
        result.text = ' Not available for selected model';
      }
    }

    if (intOrientationID === ClsID.intOrientationHorizontalID) {
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
  data: {
    novaUnitModelVoltageLink: any[];
    ventumHUnitModelVoltageLink: any[];
    ventumLiteUnitModelVoltageLink: any[];
    ventumPlusUnitModelVoltageLink: any[];
    terraUnitModelVoltageLink: any[];
    electricalVoltage: any[];
  },
  intProductTypeID: any,
  strUnitModelValue: any
) => {
  let modelVoltageLink = [];

  switch (intProductTypeID) {
    case ClsID.intProdTypeNovaID:
      modelVoltageLink = data?.novaUnitModelVoltageLink;
      break;
    case ClsID.intProdTypeVentumID:
      modelVoltageLink = data?.ventumHUnitModelVoltageLink;
      break;
    case ClsID.intProdTypeVentumLiteID:
      modelVoltageLink = data?.ventumLiteUnitModelVoltageLink;
      break;
    case ClsID.intProdTypeVentumPlusID:
      modelVoltageLink = data?.ventumPlusUnitModelVoltageLink;
      break;
    case ClsID.intProdTypeTerraID:
      modelVoltageLink = data?.terraUnitModelVoltageLink;
      break;
    default:
      break;
  }

  const dtLink =
    modelVoltageLink?.filter(
      (item: { unit_model_value: any }) => item.unit_model_value === strUnitModelValue
    ) || [];
  let dtVoltage = data?.electricalVoltage;
  if (intProductTypeID === ClsID.intProdTypeTerraID && true) {
    dtVoltage = data?.electricalVoltage?.filter(
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
  data: { components: any; heatExch: any },
  intProductTypeID: any,
  intUnitTypeID: any
) => {
  const unitCoolingHeadingInfo = data?.components;
  const heatExchangeInfo = data?.heatExch;

  let dtPreheatComp = unitCoolingHeadingInfo;
  let dtHeatExchComp = heatExchangeInfo;
  let dtCoolingComp = unitCoolingHeadingInfo;
  let dtHeatingComp = unitCoolingHeadingInfo;

  if (intUnitTypeID === ClsID.intUnitTypeERV_ID) {
    dtPreheatComp =
      unitCoolingHeadingInfo?.filter((e: { erv_preheat: any }) => Number(e.erv_preheat) === 1) ||
      [];

    if (intProductTypeID === ClsID.intProdTypeVentumLiteID) {
      dtPreheatComp =
        unitCoolingHeadingInfo?.filter(
          (item: { id: any }) => Number(item.id) !== ClsID.intCompHWC_ID
        ) || [];
    }

    dtHeatExchComp = heatExchangeInfo?.filter((e: { erv: any }) => Number(e.erv) === 1) || [];

    dtCoolingComp =
      unitCoolingHeadingInfo?.filter((e: { erv_cooling: any }) => Number(e.erv_cooling) === 1) ||
      [];

    dtHeatingComp =
      unitCoolingHeadingInfo?.filter((e: { erv_heating: any }) => Number(e.erv_heating) === 1) ||
      [];
  } else if (intUnitTypeID === ClsID.intUnitTypeHRV_ID) {
    dtPreheatComp =
      unitCoolingHeadingInfo?.filter((e: { hrv_preheat: any }) => Number(e.hrv_preheat) === 1) ||
      [];

    if (intProductTypeID === ClsID.intProdTypeVentumLiteID) {
      dtPreheatComp = unitCoolingHeadingInfo?.filter(
        (e: { id: string }) => parseInt(e.id, 10) !== ClsID.intCompHWC_ID
      );
    }

    dtHeatExchComp = heatExchangeInfo?.filter((e: { hrv: any }) => Number(e.hrv) === 1) || [];

    dtCoolingComp =
      unitCoolingHeadingInfo?.filter((e: { hrv_cooling: any }) => Number(e.hrv_cooling) === 1) ||
      [];

    dtHeatingComp =
      unitCoolingHeadingInfo?.filter((e: { hrv_heating: any }) => Number(e.hrv_heating) === 1) ||
      [];
  } else if (intUnitTypeID === ClsID.intUnitTypeAHU_ID) {
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
  data: { elecHeaterInstallation: any[]; electricHeaterInstallProdTypeLink: any },
  intPreheatCompID: any,
  intLocationID: any,
  intProductTypeID: any
) => {
  const returnInfo: any = {
    ddlPreheatElecHeaterInstallationDataTbl: [],
    ddlPreheatElecHeaterInstallationId: 0,
  };

  let dtPreheatElecHeaterInstallation = data?.elecHeaterInstallation?.filter(
    (item: { id: number }) => item.id !== 1
  );
  if (intPreheatCompID === ClsID.intCompElecHeaterID || intPreheatCompID === ClsID.intCompAutoID) {
    returnInfo.ddlPreheatElecHeaterInstallationDataTbl = dtPreheatElecHeaterInstallation;

    if (intLocationID === ClsID.intLocationOutdoorID) {
      switch (intProductTypeID) {
        case ClsID.intProdTypeNovaID:
        case ClsID.intProdTypeVentumID:
        case ClsID.intProdTypeVentumLiteID:
        case ClsID.intProdTypeTerraID:
          dtPreheatElecHeaterInstallation = dtPreheatElecHeaterInstallation?.filter(
            (item: { id: any }) => item.id === ClsID.intElecHeaterInstallInCasingFieldID
          );
          break;
        case ClsID.intProdTypeVentumPlusID:
          dtPreheatElecHeaterInstallation = dtPreheatElecHeaterInstallation?.filter(
            (item: { id: any }) => item.id === ClsID.intElecHeaterInstallInCasingFactoryID
          );
          break;

        default:
          break;
      }
    } else {
      let dtLink = data?.electricHeaterInstallProdTypeLink;
      dtLink =
        dtLink?.filter(
          (item: { product_type_id: any }) => item.product_type_id === intProductTypeID
        ) || [];

      dtPreheatElecHeaterInstallation = dtPreheatElecHeaterInstallation?.filter(
        (e: { id: any }) =>
          dtLink?.filter(
            (e_link: { elec_heater_install_id: any }) => e.id === e_link.elec_heater_install_id
          )?.length === 1 // 1: Matching items, 0: Not matching items
      );

      switch (intProductTypeID) {
        case ClsID.intProdTypeNovaID:
        case ClsID.intProdTypeVentumID:
          returnInfo.ddlPreheatElecHeaterInstallationId =
            ClsID.intElecHeaterInstallInCasingFieldID.toString();
          break;
        case ClsID.intProdTypeTerraID:
        case ClsID.intProdTypeVentumPlusID:
          returnInfo.ddlPreheatElecHeaterInstallationId =
            ClsID.intElecHeaterInstallInCasingFactoryID.toString();
          break;
        case ClsID.intProdTypeVentumLiteID:
          dtPreheatElecHeaterInstallation = dtPreheatElecHeaterInstallation?.filter(
            (item: { id: any }) => item.id === ClsID.intElecHeaterInstallDuctMountedID
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

export const getItemsAddedOnIDDataTable = (
  dt: string | any[],
  strColumnMultipleID: string,
  intMatchID: number
) => {
  const newDt = [];

  for (let i = 0; i < dt?.length; i += 1) {
    const strArrID = dt[i][strColumnMultipleID].split(',');

    for (let j = 0; j < strArrID?.length; j += 1) {
      if (parseInt(strArrID[j], 10) === intMatchID) {
        const dr = {
          id: parseInt(dt[i].id, 10),
          items: dt[i].items,
        };

        newDt.push(dr);
        break;
      }
    }
  }

  return newDt;
};

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

  if (intPreheatCompID === ClsID.intCompHWC_ID) {
    returnInfo.divPreheatHWC_UseFlowRateVisible = true;
    returnInfo.divPreheatHWC_FlowRateVisible = true;

    if (intUnitTypeID === ClsID.intUnitTypeAHU_ID) {
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

  if (intCoolingCompID === ClsID.intCompCWC_ID) {
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

  if (intHeatingCompID === ClsID.intCompHWC_ID) {
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

  if (intReheatCompID === ClsID.intCompHWC_ID) {
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

  if (intCoolingCompID === ClsID.intCompCWC_ID) {
    returnInfo.ckbHeatPumpVal = false;
    returnInfo.divHeatPumpVisible = false;
  } else if (intCoolingCompID === ClsID.intCompDX_ID) {
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
  if (intCoolingCompID === ClsID.intCompCWC_ID || intCoolingCompID === ClsID.intCompDX_ID) {
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
    returnInfo.divDXCoilRefrigDesignCondVisible = intCoolingCompID === ClsID.intCompDX_ID;
  } else {
    returnInfo.divDXCoilRefrigDesignCondVisible = false;
  }

  return returnInfo;
};

export const getHeatElecHeaterInstallationInfo = (
  data: { elecHeaterInstallation: any },
  intHeatingCompID: any,
  intReheatCompID: any
) => {
  const returnInfo = {
    ddlHeatElecHeaterInstallationDataTbl: [],
    ddlHeatElecHeaterInstallationId: 0,
  };

  if (
    intHeatingCompID === ClsID.intCompElecHeaterID ||
    intReheatCompID === ClsID.intCompElecHeaterID
  ) {
    returnInfo.ddlHeatElecHeaterInstallationId = 1;

    let dtElecHeaterInstallation = data?.elecHeaterInstallation;
    dtElecHeaterInstallation = dtElecHeaterInstallation?.filter(
      (item: { id: number }) => item.id !== 0
    );

    returnInfo.ddlHeatElecHeaterInstallationDataTbl = dtElecHeaterInstallation;
  } else {
    returnInfo.ddlHeatElecHeaterInstallationId = 0;

    let dtElecHeaterInstallation = data?.elecHeaterInstallation;
    dtElecHeaterInstallation = dtElecHeaterInstallation?.filter(
      (item: { id: number }) => item.id !== 0
    );

    returnInfo.ddlHeatElecHeaterInstallationDataTbl = dtElecHeaterInstallation;
  }

  return returnInfo;
};

export const getReheatInfo = (
  data: { components: any[] },
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
    dtReheatComp = data?.components;

    switch (intCoolingCompID) {
      case ClsID.intCompCWC_ID:
        dtReheatComp = dtReheatComp?.filter(
          (item: { id: { toString: () => any } }) =>
            item.id.toString() !== ClsID.intCompHGRH_ID.toString()
        );
        break;
      case ClsID.intCompDX_ID:
        if (
          intUAL === ClsID.intUAL_External &&
          (intUnitTypeID === ClsID.intUnitTypeERV_ID || intUnitTypeID === ClsID.intUnitTypeHRV_ID)
        ) {
          dtReheatComp = dtReheatComp?.filter(
            (item: { id: { toString: () => any } }) =>
              item.id.toString() !== ClsID.intCompHGRH_ID.toString()
          );
        } else if (
          intProductTypeID === ClsID.intProdTypeVentumID &&
          (intUnitModelID === ClsID.intVentumUnitModelID_H05IN_ERV ||
            intUnitModelID === ClsID.intVentumUnitModelID_H05IN_HRV)
        ) {
          dtReheatComp = dtReheatComp?.filter(
            (item: { id: { toString: () => any } }) =>
              item.id.toString() !== ClsID.intCompHGRH_ID.toString()
          );
        }
        break;
      default:
        break;
    }

    switch (intUnitTypeID) {
      case ClsID.intUnitTypeERV_ID:
        dtReheatComp =
          dtReheatComp?.filter((e: { erv_reheat: any }) => Number(e.erv_reheat) === 1) || [];
        break;
      case ClsID.intUnitTypeHRV_ID:
        dtReheatComp =
          dtReheatComp?.filter((e: { hrv_reheat: any }) => Number(e.hrv_reheat) === 1) || [];
        break;
      case ClsID.intUnitTypeAHU_ID:
        dtReheatComp =
          dtReheatComp?.filter((e: { fc_reheat: any }) => Number(e.fc_reheat) === 1) || [];
        break;
      default:
        // code block
        break;
    }

    reheatInfo.dtReheatComp = dtReheatComp;
    reheatInfo.ddlReheatCompId = dtReheatComp?.[0]?.id;
    reheatInfo.divReheatCompVisible = true;
  } else {
    dtReheatComp = data?.components;
    reheatInfo.dtReheatComp = dtReheatComp;
    reheatInfo.ddlReheatCompId = ClsID.intCompNA_ID;
    reheatInfo.divReheatCompVisible = false;
  }

  return reheatInfo;
};

export const getHeatingFluidDesignCondInfo = (
  data: { fluidType: any; fluidConcentration: any },
  intPreheatCompID: any,
  intHeatingCompID: any,
  intReheatCompID: any
) => {
  const returnInfo: {
    divHeatingFluidDesignCondVisible?: boolean;
    ddlHeatingFluidTypeDataTbl?: any;
    ddlHeatingFluidTypeId?: number;
    ddlHeatingFluidConcentrationDataTbl?: any;
    ddlHeatingFluidConcentrationId?: number;
  } = {};

  returnInfo.divHeatingFluidDesignCondVisible = !!(
    intPreheatCompID === ClsID.intCompHWC_ID ||
    intHeatingCompID === ClsID.intCompHWC_ID ||
    intReheatCompID === ClsID.intCompHWC_ID
  );

  const dtHeatingFluidType = data?.fluidType;
  returnInfo.ddlHeatingFluidTypeDataTbl = dtHeatingFluidType;
  returnInfo.ddlHeatingFluidTypeId = dtHeatingFluidType?.[0]?.id;
  returnInfo.ddlHeatingFluidConcentrationDataTbl = getItemsAddedOnIDDataTable(
    data?.fluidConcentration,
    'fluid_type_id',
    returnInfo.ddlHeatingFluidTypeId || 0
  );
  returnInfo.ddlHeatingFluidConcentrationId =
    returnInfo.ddlHeatingFluidConcentrationDataTbl?.[0]?.id;

  return returnInfo;
};

export const getDamperAndActuatorInfo = (
  data: { damperActuator: any },
  intProductTypeID: any,
  intLocationID: any
) => {
  const returnInfo: {
    ddlDamperAndActuatorDataTbl?: any;
    ddlDamperAndActuatorId?: number;
    divDamperAndActuatorVisible?: boolean;
  } = {};

  let dtDamperAndAct = data?.damperActuator;

  switch (intProductTypeID) {
    case ClsID.intProdTypeNovaID:
    case ClsID.intProdTypeVentumID:
    case ClsID.intProdTypeVentumLiteID:
    case ClsID.intProdTypeTerraID:
      dtDamperAndAct = dtDamperAndAct?.filter(
        (item: { std_selection: number }) => item.std_selection === 1
      );
      break;
    case ClsID.intProdTypeVentumPlusID:
      dtDamperAndAct = dtDamperAndAct?.filter(
        (item: { ventumplus: number }) => item.ventumplus === 1
      );
      break;
    default:
      break;
  }

  returnInfo.ddlDamperAndActuatorDataTbl = dtDamperAndAct;
  returnInfo.ddlDamperAndActuatorId = dtDamperAndAct?.[0]?.id;

  if (intLocationID === ClsID.intLocationOutdoorID) {
    switch (intProductTypeID) {
      case ClsID.intProdTypeNovaID:
      case ClsID.intProdTypeVentumID:
      case ClsID.intProdTypeVentumLiteID:
      case ClsID.intProdTypeTerraID:
        returnInfo.ddlDamperAndActuatorId = ClsID.intDamperActFieldInstAndWiredID;
        break;
      case ClsID.intProdTypeVentumPlusID:
        returnInfo.ddlDamperAndActuatorId = ClsID.intDamperActFactMountedAndWiredID;
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
  data: { electricalVoltage: any[] },
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
    intPreheatCompID === ClsID.intCompElecHeaterID ||
    intHeatingCompID === ClsID.intCompElecHeaterID ||
    intReheatCompID === ClsID.intCompElecHeaterID
  ) {
    returnInfo.divElecHeaterVoltageVisible = true;

    let bol208V_1Ph = false;
    // intProdTypeNovaID
    if (intProductTypeID === ClsID.intProdTypeNovaID) {
      if (intUnitModelID) {
        dtElecHeaterVoltage = data?.electricalVoltage;
        // const dtLink = data?.novaElecHeatVoltageLink.filter((x) => x.unit_model_value === strUnitModelValue);

        if (intUnitVoltageID) {
          intSelectedValue = intUnitModelID;
        }

        // dtElecHeaterVoltage = dtElecHeaterVoltage.map(
        //   (item) => dtLink.filter((el) => el.voltage_id === item.id)?.length > 0
        // );
      }
      // intProdTypeVentumID
    } else if (intProductTypeID === ClsID.intProdTypeVentumID) {
      if (
        intUnitModelID === ClsID.intVentumUnitModelID_H05IN_ERV ||
        intUnitModelID === ClsID.intVentumUnitModelID_H10IN_ERV ||
        intUnitModelID === ClsID.intVentumUnitModelID_H05IN_HRV ||
        intUnitModelID === ClsID.intVentumUnitModelID_H10IN_HRV
      ) {
        bol208V_1Ph = true;
        dtElecHeaterVoltage = data?.electricalVoltage?.filter(
          (item: { electric_heater_2: number; id: any }) =>
            item.electric_heater_2 === 1 || item.id === intElecHeaterVoltageID
        );
      } else {
        dtElecHeaterVoltage = data?.electricalVoltage?.filter(
          (item: { electric_heater: number; id: any }) =>
            item.electric_heater === 1 || item.id === intElecHeaterVoltageID
        );
      }

      if (bol208V_1Ph) {
        returnInfo.ddlElecHeaterVoltageId = ClsID.intElectricVoltage_208V_1Ph_60HzID;
        enabled = false;
      } else {
        returnInfo.ddlElecHeaterVoltageId = ClsID.intElectricVoltage_208V_3Ph_60HzID;
      }

      if (ckbVoltageSPPVal) {
        returnInfo.ddlElecHeaterVoltageEnabled = false;
      } else {
        returnInfo.ddlElecHeaterVoltageEnabled = true;
      }
      // intProdTypeVentumLiteID
    } else if (intProductTypeID === ClsID.intProdTypeVentumLiteID) {
      bol208V_1Ph = true;
      dtElecHeaterVoltage = data?.electricalVoltage?.filter(
        (item: { electric_heater_3: number; id: any }) =>
          item.electric_heater_3 === 1 || item.id === intElecHeaterVoltageID
      );

      if (dtElecHeaterVoltage?.length > 0) {
        if (bol208V_1Ph) {
          intSelectedValue = ClsID.intElectricVoltage_208V_1Ph_60HzID;
        } else {
          intSelectedValue = ClsID.intElectricVoltage_208V_3Ph_60HzID;
        }
      }
      // intProdTypeVentumPlusID
    } else if (intProductTypeID === ClsID.intProdTypeVentumPlusID) {
      dtElecHeaterVoltage = data?.electricalVoltage?.filter(
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
          intSelectedValue = ClsID.intElectricVoltage_208V_1Ph_60HzID;
        } else {
          intSelectedValue = ClsID.intElectricVoltage_208V_3Ph_60HzID;
        }
      }
      // intProdTypeTerraID
    } else if (intProductTypeID === ClsID.intProdTypeTerraID) {
      if (ckbVoltageSPPVal) {
        dtElecHeaterVoltage = data?.electricalVoltage?.filter(
          (item: { terra_spp: number; id: any }) =>
            item.terra_spp === 1 || item.id === intElecHeaterVoltageID
        );
        intSelectedValue = getDdlLockItem(dtElecHeaterVoltage, intUnitVoltageID);
        enabled = false;
      } else {
        dtElecHeaterVoltage = data?.electricalVoltage?.filter(
          (item: { terra_non_spp: number; id: any }) =>
            item.terra_non_spp === 1 || item.id === intElecHeaterVoltageID
        );
        enabled = true;
      }

      if (dtElecHeaterVoltage?.length > 0) {
        if (bol208V_1Ph) {
          intSelectedValue = ClsID.intElectricVoltage_208V_1Ph_60HzID;
        } else {
          intSelectedValue = ClsID.intElectricVoltage_208V_3Ph_60HzID;
        }
      }
    }
    if (
      intPreheatCompID === ClsID.intCompAutoID &&
      intHeatingCompID !== ClsID.intCompElecHeaterID &&
      intReheatCompID !== ClsID.intCompElecHeaterID
    ) {
      visibled = false;
    }
  } else {
    if (intProductTypeID === ClsID.intProdTypeVentumLiteID) {
      dtElecHeaterVoltage = data?.electricalVoltage?.filter(
        (item: { electric_heater_3: number; id: any }) =>
          item.electric_heater_3 === 1 || item.id === intElecHeaterVoltageID
      );
      intSelectedValue = intUnitVoltageID;
      enabled = false;
    } else if (intProductTypeID === ClsID.intProdTypeTerraID && ckbVoltageSPPVal) {
      dtElecHeaterVoltage = data?.electricalVoltage?.filter(
        (item: { terra_spp: number; id: any }) =>
          item.terra_spp === 1 || item.id === intElecHeaterVoltageID
      );
      intSelectedValue = getDdlLockItem(dtElecHeaterVoltage, intUnitVoltageID);
      enabled = false;
    } else if (
      intProductTypeID === ClsID.intProdTypeVentumPlusID &&
      (ckbVoltageSPPVal || intPreheatCompID === ClsID.intCompAutoID)
    ) {
      dtElecHeaterVoltage = data?.electricalVoltage?.filter(
        (item: { ventumplus_elec_heater: number; id: any }) =>
          item.ventumplus_elec_heater === 1 || item.id === intElecHeaterVoltageID
      );
      intSelectedValue = getDdlLockItem(dtElecHeaterVoltage, intUnitVoltageID);
      enabled = false;
    } else {
      dtElecHeaterVoltage = data?.electricalVoltage?.filter(
        (item: { electric_heater: number; id: any }) =>
          item.electric_heater === 1 || item.id === intElecHeaterVoltageID
      );
      intSelectedValue = ClsID.intElectricVoltage_208V_3Ph_60HzID;
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
    intCoolingCompID === ClsID.intCompCWC_ID ||
    intPreheatCompID === ClsID.intCompHWC_ID ||
    intHeatingCompID === ClsID.intCompHWC_ID ||
    intReheatCompID === ClsID.intCompHWC_ID
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

  if (intProductTypeID === ClsID.intProdTypeNovaID) {
    returnInfo.divDrainPanVisible = false;
    returnInfo.ckbDrainPanVal = 0;
  } else if (
    intProductTypeID === ClsID.intProdTypeVentumID ||
    intProductTypeID === ClsID.intProdTypeVentumLiteID ||
    intProductTypeID === ClsID.intProdTypeVentumPlusID
  ) {
    if (intUnitTypeID === ClsID.intUnitTypeERV_ID) {
      returnInfo.divDrainPanVisible = false;
      returnInfo.ckbDrainPanVal = 0;
    } else if (intUnitTypeID === ClsID.intUnitTypeHRV_ID) {
      returnInfo.divDrainPanVisible = true;
      returnInfo.ckbDrainPanVal = 1;
    }
  }

  return returnInfo;
};

export const getHandingInfo = (data: { handing: any }) => {
  const returnInfo: {
    ddlHandingDataTbl: any;
    ddlHandingId: number;
  } = {
    ddlHandingDataTbl: undefined,
    ddlHandingId: 0,
  };

  returnInfo.ddlHandingDataTbl = data?.handing;
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
  data: { oriOpeningERV_SA_Link: any[]; openingERV_SA: any[]; openingAHU_SA: any[] },
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
  let dtLink: any[] = [];
  let dtSelectionTable = [];
  let dtSelectionFinalTable: any = [];

  if (intUnitTypeID === ClsID.intUnitTypeERV_ID || intUnitTypeID === ClsID.intUnitTypeHRV_ID) {
    dtLink = data?.oriOpeningERV_SA_Link?.filter(
      (item: { product_type_id: number }) => item.product_type_id === Number(intProductTypeID)
    );
    dtLink = dtLink?.filter(
      (item: { location_id: number }) => item.location_id === Number(intLocationID)
    );
    dtLink = dtLink?.filter(
      (item: { orientation_id: number }) => item.orientation_id === Number(intOrientationID)
    );
    dtSelectionTable = data?.openingERV_SA;
    dtSelectionTable = dtSelectionTable?.filter(
      (item: { product_type_id: number }) => item.product_type_id === Number(intProductTypeID)
    );
    dtSelectionFinalTable = dtSelectionTable?.filter(
      (e: { items: any }) =>
        dtLink?.filter((e_link) => e.items === e_link.openings_sa)?.length === 1 // 1: Matching items, 0: Not matching items
    );

    returnInfo.ddlSupplyAirOpeningDataTbl = dtSelectionFinalTable;

    if (
      intOrientationID === ClsID.intOrientationVerticalID &&
      (intCoolingCompID > 1 || intHeatingCompID > 1 || intReheatCompID > 1)
    ) {
      returnInfo.ddlSupplyAirOpeningId = ClsID.intSA_Open_2_ID;
    }

    if (isContain(dtSelectionFinalTable, 'items', strSupplyAirOpening)) {
      returnInfo.ddlSupplyAirOpeningId = intSupplyAirOpeningId;
      returnInfo.ddlSupplyAirOpeningText = strSupplyAirOpening;
    } else {
      returnInfo.ddlSupplyAirOpeningId = dtSelectionTable?.[0]?.id;
      returnInfo.ddlSupplyAirOpeningText = dtSelectionTable?.[0]?.items.toString();
    }
  } else if (intUnitTypeID === ClsID.intUnitTypeAHU_ID) {
    dtSelectionTable = data?.openingAHU_SA;

    returnInfo.ddlSupplyAirOpeningDataTbl = dtSelectionTable;
    if (isContain(dtSelectionFinalTable, 'items', strSupplyAirOpening)) {
      returnInfo.ddlSupplyAirOpeningId = intSupplyAirOpeningId;
      returnInfo.ddlSupplyAirOpeningText = strSupplyAirOpening;
    } else {
      returnInfo.ddlSupplyAirOpeningId = dtSelectionTable?.[0]?.id;
      returnInfo.ddlSupplyAirOpeningText = dtSelectionTable?.[0]?.items.toString();
    }
  }

  return returnInfo;
};

export const getRemainingOpeningsInfo = (
  data: {
    openingERV_SA_EA_Link: any[];
    openingERV_EA: any[];
    openingERV_SA_OA_Link: any[];
    openingERV_OA: any[];
    openingERV_SA_RA_Link: any[];
    openingERV_RA: any[];
    openingAHU_OA: any[];
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
  let dtLink: any[] = [];
  let dtSelectionTable = [];
  let dtSelectionFinalTable = [];

  if (intUnitTypeID === ClsID.intUnitTypeERV_ID || intUnitTypeID === ClsID.intUnitTypeHRV_ID) {
    dtLink = data?.openingERV_SA_EA_Link?.filter(
      (item: { product_type_id: any }) => item.product_type_id === intProductTypeID
    );
    dtLink = dtLink?.filter(
      (item: { openings_sa: any }) => item.openings_sa === strSupplyAirOpening
    );
    dtLink = dtLink?.filter(
      (item: { orientation_id: number }) => item.orientation_id === Number(intOrientationID)
    );

    dtSelectionTable = data?.openingERV_EA;
    dtSelectionTable = dtSelectionTable?.filter(
      (item: { product_type_id: number }) => item.product_type_id === Number(intProductTypeID)
    );
    dtSelectionFinalTable = dtSelectionTable?.filter(
      (e: { items: any }) =>
        dtLink?.filter((e_link) => e.items === e_link.openings_ea)?.length === 1 // 1: Matching items, 0: Not matching items
    );

    returnInfo.ddlExhaustAirOpeningDataTbl = dtSelectionFinalTable;
    returnInfo.ddlExhaustAirOpeningId = dtSelectionFinalTable[0]?.id;
    returnInfo.ddlExhaustAirOpeningText = dtSelectionFinalTable[0]?.items;
    returnInfo.ddlExhaustAirOpeningVisible = true;

    dtLink = data?.openingERV_SA_OA_Link?.filter(
      (item: { product_type_id: any }) => item.product_type_id === intProductTypeID
    );
    dtLink = dtLink?.filter(
      (item: { openings_sa: any }) => item.openings_sa === strSupplyAirOpening
    );
    dtLink = dtLink?.filter(
      (item: { orientation_id: any }) => item.orientation_id === intOrientationID
    );

    dtSelectionTable = data?.openingERV_OA;
    dtSelectionTable = dtSelectionTable?.filter(
      (item: { product_type_id: number }) => item.product_type_id === Number(intProductTypeID)
    );
    dtSelectionFinalTable = dtSelectionTable?.filter(
      (e: { items: any }) =>
        dtLink?.filter((e_link) => e.items === e_link.openings_oa)?.length === 1 // 1: Matching items, 0: Not matching items
    );

    returnInfo.ddlOutdoorAirOpeningDataTbl = dtSelectionFinalTable;
    returnInfo.ddlOutdoorAirOpeningId = dtSelectionFinalTable[0]?.id;
    returnInfo.ddlOutdoorAirOpeningText = dtSelectionFinalTable[0]?.items;

    dtLink = data?.openingERV_SA_RA_Link?.filter(
      (item: { product_type_id: any }) => item.product_type_id === intProductTypeID
    );
    dtLink = dtLink?.filter(
      (item: { openings_sa: any }) => item.openings_sa === strSupplyAirOpening
    );
    dtLink = dtLink?.filter(
      (item: { orientation_id: number }) => item.orientation_id === Number(intOrientationID)
    );

    dtSelectionTable = data?.openingERV_RA;
    dtSelectionTable = dtSelectionTable?.filter(
      (item: { product_type_id: number }) => item.product_type_id === Number(intProductTypeID)
    );
    dtSelectionFinalTable = dtSelectionTable?.filter(
      (e: { items: any }) =>
        dtLink?.filter((e_link) => e.items === e_link.openings_ra)?.length === 1 // 1: Matching items, 0: Not matching items
    );

    returnInfo.ddlReturnAirOpeningDataTbl = dtSelectionFinalTable;
    returnInfo.ddlReturnAirOpeningId = dtSelectionFinalTable[0]?.id;
    returnInfo.ddlReturnAirOpeningText = dtSelectionFinalTable[0]?.items;
    returnInfo.ddlReturnAirOpeningVisible = true;
  } else if (intUnitTypeID === ClsID.intUnitTypeAHU_ID) {
    dtSelectionTable = data?.openingAHU_OA;

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
  data: { locOriLink: any[]; generalOrientation: any },
  intProductTypeID: any,
  intUnitTypeID: any,
  intLocationID: any,
  intSummerSupplyAirCFM: number
) => {
  const dtLocOri = data?.locOriLink?.filter(
    (item: { product_type_id: any; unit_type_id: any; location_id: any }) =>
      item.product_type_id === intProductTypeID &&
      item.unit_type_id === intUnitTypeID &&
      item.location_id === intLocationID
  );

  let dtOrientation = getFromLink(data?.generalOrientation, 'orientation_id', dtLocOri, 'max_cfm');

  if (intProductTypeID === ClsID.intProdTypeNovaID) {
    dtOrientation = dtOrientation?.filter((item) => item.max_cfm >= intSummerSupplyAirCFM);
  }

  return dtOrientation?.filter((item) => !!item.id);
};

export const getLocation = (
  data: { prodTypeUnitTypeLocLink: any[]; generalLocation: any[] },
  intProductTypeID: number,
  intUnitTypeID: number
) => {
  const dtProdUnitLocLink = data?.prodTypeUnitTypeLocLink?.filter(
    (item: { product_type_id: any; unit_type_id: any }) =>
      item.product_type_id === intProductTypeID && item.unit_type_id === intUnitTypeID
  );

  return data?.generalLocation?.filter(
    (e: { id: any }) =>
      dtProdUnitLocLink?.filter((e_link: { location_id: any }) => e_link.location_id === e.id)
        ?.length > 0
  );
};

export default function Index() {
  return null;
}
