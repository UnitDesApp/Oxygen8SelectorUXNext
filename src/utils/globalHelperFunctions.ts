// global helper functions

export const moveArrayItem = (array : any, from : number, to : number) => {
    const item = array?.[from];
    array?.splice(from, 1);
    array?.splice(to, 0, item);
    return array;
  };


  // const setValueWithCheck = useCallback(
  //   (e: any, key: any) => {
  //     if (e.target.value === '') {
  //       setValue(key, '');
  //     } else if (e.target.value[0] === '0') {
  //       setValue(key, '0');
  //       return true;
  //     } else if (!Number.isNaN(+e.target.value)) {
  //       setValue(key, parseFloat(e.target.value));
  //       return true;
  //     }
  //     return false;
  //   },
  //   [setValue]
  // );

  // const setValueWithCheck1 = useCallback(
  //   (e: any, key: any) => {
  //     if (e.target.value === '') {
  //       setValue(key, '');
  //     } else if (!Number.isNaN(Number(+e.target.value))) {
  //       setValue(key, e.target.value);
  //       return true;
  //     }
  //     return false;
  //   },
  //   [setValue]
  // );
