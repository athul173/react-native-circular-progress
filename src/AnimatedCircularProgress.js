import React from "react";
import PropTypes from "prop-types";
import { Animated, Easing } from "react-native";
import CircularProgress from "./CircularProgress";
const AnimatedProgress = Animated.createAnimatedComponent(CircularProgress);

export default class AnimatedCircularProgress extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      fillAnimation: new Animated.Value(props.prefill),
    };
    if (props.onFillChange) {
      this.state.fillAnimation.addListener(({ value }) =>
        props.onFillChange(value)
      );
    }
  }

  componentDidMount() {
    this.animate();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.fill !== this.props.fill) {
      this.animate();
    }
  }

  reAnimate(prefill, toVal, dur, ease) {
    this.setState(
      {
        fillAnimation: new Animated.Value(prefill),
      },
      () => this.animate(toVal, dur, ease)
    );
  }

  animate(toVal, dur, ease) {
    const toValue = toVal >= 0 ? toVal : this.props.fill;
    const duration = dur || this.props.duration;
    const easing = ease || this.props.easing;
    const useNativeDriver = this.props.useNativeDriver;
    const delay = this.props.delay;

    const anim = Animated.timing(this.state.fillAnimation, {
      useNativeDriver,
      toValue,
      easing,
      duration,
      delay,
    });
    anim.start(this.props.onAnimationComplete);

    return anim;
  }

  getColorLocations(colorArray) {
    const splitValue = 100 / colorArray.length;
    let locationsArray = [];
    for (i = 1; i <= colorArray.length; i++) {
      locationsArray.push(splitValue * i);
    }
    return locationsArray;
  }

  animateColor() {
    if (typeof this.props.tintColors === "string") {
      return this.props.tintColors;
    }

    if (this.props.tintColors?.length === 1) {
      return this.props.tintColors[0];
    }

    const tintAnimation = this.state.fillAnimation.interpolate({
      inputRange: this.getColorLocations(this.props.tintColors),
      outputRange: this.props.tintColors,
    });

    return tintAnimation;
  }

  render() {
    const { fill, prefill, ...other } = this.props;

    return (
      <AnimatedProgress
        {...other}
        fill={this.state.fillAnimation}
        tintColors={this.animateColor()}
      />
    );
  }
}

AnimatedCircularProgress.propTypes = {
  ...CircularProgress.propTypes,
  prefill: PropTypes.number,
  duration: PropTypes.number,
  easing: PropTypes.func,
  onAnimationComplete: PropTypes.func,
  useNativeDriver: PropTypes.bool,
  delay: PropTypes.number,
};

AnimatedCircularProgress.defaultProps = {
  duration: 500,
  easing: Easing.out(Easing.ease),
  prefill: 0,
  useNativeDriver: false,
  delay: 0,
};
