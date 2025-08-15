export const generatePagination = (currenPage: number, totalPages: number) => {
  ///si el numero de pagina es menor a 7
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if(currenPage<=3){
    return [1,2,3,'...',totalPages-1,totalPages];
  }
  if(currenPage>=totalPages-2){
    return [1,2,'...',totalPages-2,totalPages-1,totalPages];
  }

  return [
    1,
    '...',
    currenPage - 1,
    currenPage,
    currenPage + 1,
    '...',
    totalPages,
  ]
};
