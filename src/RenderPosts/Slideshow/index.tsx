import { Children, Component, KeyboardEvent, ReactNode } from "react";
import style from "./index.module.css";
import arrow from "./resources/caret-left-fill.svg";

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

interface NavProps {
  onClick: () => void;
  facing: "left" | "right"
}

function NavButton(props: NavProps) {
  return (
    <div onClick={props.onClick} className={style.navButton}>
      {
        (props.facing === "left") ?
          <img src={arrow} alt="Go back." />
          :
          <img src={arrow} className={style.flipped} alt="Go forward." />
      }
    </div>
  )
}

interface SlideShowProps {
  slideChangeDelay: number;
  children: ReactNode;
}

interface SlideShowState {
  slide: number;
  transitionState: "done" | "fadeOut"
}

export class BasicSlideshow extends Component<SlideShowProps, SlideShowState> {
  timer?: NodeJS.Timer;
  constructor(props: SlideShowProps) {
    super(props);

    this.state = {slide: 0, transitionState: "done"};

    this.onNavigationPress = this.onNavigationPress.bind(this);
    this.onNavigationKeyDown = this.onNavigationKeyDown.bind(this);

    if (!!this.props.slideChangeDelay) {
      this.timer = setInterval(() => this.changeSlide(1), this.props.slideChangeDelay);
    }
  }

  render() {
    return (
      <div 
        onKeyDown={this.onNavigationKeyDown} 
        className={style.asTable}
        tabIndex={0}
      >
        <NavButton 
          onClick={() => this.onNavigationPress(-1)} 
          facing="left" 
        />

        <div className={style.navContent}>
          <div className={style.slideContainer}>
            {
              Children.map(this.props.children, (e, i) => (
                <div 
                  className={
                    style.slide
                    + " " + (this.state.slide !== i ? style.fadeOut : "")
                    + " " + (this.state.transitionState === "fadeOut" ? style.fadeOut : "")
                  } 
                  key={i}
                >{e}</div>
              ))
            }
          </div>
        </div>

        <NavButton 
          onClick={() => this.onNavigationPress(1)} 
          facing="right" 
        />
      </div>
    )
  }

  changeSlide(direction: number) {
    this.setState({transitionState: "fadeOut"});
    setTimeout(() => this.setState({
      slide: mod(this.state.slide + direction, Children.count(this.props.children)), 
      transitionState: "done"
    }), 500);
  }

  onNavigationPress(direction: number) {
    clearInterval(this.timer);
    this.changeSlide(direction);
  }

  onNavigationKeyDown(event: KeyboardEvent) {
    if (event.key === "ArrowLeft") {
      this.onNavigationPress(-1);
    } else if (event.key === "ArrowRight" || event.key === " ") {
      this.onNavigationPress(1);
    }
  }
}