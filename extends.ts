Date.prototype.diff = function (unit: "H", compareDate: Date | number) {
  switch (unit) {
    case "H":
      return (
        Math.abs(
          this.getTime() -
            (typeof compareDate === "number"
              ? compareDate
              : compareDate.getTime())
        ) / 36e5
      );
  }
};

export {};
