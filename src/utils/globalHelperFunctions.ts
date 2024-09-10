// global helper functions

export const moveArrayItem = (array : any, from : number, to : number) => {
    const item = array?.[from];
    array?.splice(from, 1);
    array?.splice(to, 0, item);
    return array;
  };