function nth(d: number) {
  if (d > 3 && d < 21) return 'th';
  switch (d % 10) {
    case 1:  return "st";
    case 2:  return "nd";
    case 3:  return "rd";
    default: return "th";
  }
};

function monthOfYear(m: number) {
  switch (m) {
    case 0: return "January";
    case 1: return "February";
    case 2: return "March";
    case 3: return "April";
    case 4: return "May";
    case 5: return "June";
    case 6: return "July";
    case 7: return "August";
    case 8: return "September";
    case 9: return "October";
    case 10: return "November";
    case 11: return "December";
  }
}

export function DateDisplay(props: {date: Date}) {
  return <time dateTime={props.date.toISOString()}>{monthOfYear(props.date.getMonth())} {props.date.getDate()}{nth(props.date.getDate())}, {props.date.getFullYear()}</time>
}