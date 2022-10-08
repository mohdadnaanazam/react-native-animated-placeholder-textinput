import {
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import React, { useMemo, useRef } from 'react';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type InputTextProps = {
  placeholder?: string;
  textInputProps?: TextInputProps;
  labelTopValue?: number;
  borderColor?: string;
  borderWidth?: number;
  paddingVertical?: number;
  borderRadius?: number;
  value: string;
  onChangeText: (value: string) => void;
};

const App = (props: InputTextProps) => {
  const labelSharedValue = useSharedValue(0);

  const {
    textInputProps,
    labelTopValue = -24,
    borderColor = 'gray',
    borderWidth = 1,
    paddingVertical = 8,
    borderRadius = 5,
    placeholder = 'Email',
    value = '',
    onChangeText,
  } = props;

  const inputRef = useRef<TextInput>(null);

  const animatedLabelProps = useAnimatedStyle(() => {
    return {
      fontSize: withTiming(
        interpolate(labelSharedValue.value, [0, 1], [16, 12])
      ),
      top: withTiming(
        interpolate(labelSharedValue.value, [0, 1], [0, labelTopValue])
      ),
    };
  });

  const styles = useMemo(
    () =>
      StyleSheet.create({
        textInput: {
          paddingVertical: paddingVertical,
          justifyContent: 'center',
          borderWidth: borderWidth,
          borderRadius: borderRadius,
          borderColor: borderColor,
        },
        textInputStyle: {
          fontSize: 16,
          paddingHorizontal: 10,
          paddingBottom: Platform.OS === 'ios' ? 8.3 / 2 : 0,
          paddingVertical: Platform.OS === 'ios' ? 8.3 / 2 : 0,
          textAlignVertical: 'center',
          width: '100%',
        },
        textInputLabelWrapper: {
          position: 'absolute',
          left: 10,
          zIndex: 10,
          bottom: 0,
          top: 0,
          justifyContent: 'center',
        },
      }),
    [borderColor, borderRadius, borderWidth, paddingVertical]
  );

  const labelHandler = () => {
    labelSharedValue.value = 1;
    inputRef?.current?.focus();
  };

  return (
    <View style={styles.textInput}>
      <TextInput
        {...textInputProps}
        ref={inputRef}
        onFocus={() => (labelSharedValue.value = 1)}
        onBlur={() => {
          if (!value) labelSharedValue.value = 0;
        }}
        value={value}
        onChangeText={onChangeText}
        style={[styles.textInputStyle]}
      />
      <Animated.View style={styles.textInputLabelWrapper}>
        <Pressable onPress={labelHandler}>
          <Animated.Text
            style={[
              animatedLabelProps,
              { backgroundColor: 'white', paddingHorizontal: 2 },
            ]}
          >
            {placeholder}
          </Animated.Text>
        </Pressable>
      </Animated.View>
    </View>
  );
};

export default App;
