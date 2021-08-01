const calculateTotalVolume = (items) => {
  const result = {
    weight: 0,
    length_: 0,
    width_: 0,
    height_: 0,
  };
  items.forEach((item) => {
    if(item.variant){
      //item has variants
    }else{
      
    }
  });
  return result;
};

export { calculateTotalVolume };
