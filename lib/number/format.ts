const padNumbers = (index: number, padStart: number = 3) => {
    return (index).toString().padStart(padStart, '0');
   }

export { padNumbers }