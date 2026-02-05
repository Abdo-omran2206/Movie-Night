import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ToastAndroid,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { supabase } from "../../api/supabase";
import { useStore } from "../../store/store";

export default function ConfirmOTP() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const { setMood } = useStore();

  const [otp, setOtp] = useState(["", "", "", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 7) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 8) {
      if (Platform.OS === "android") {
        ToastAndroid.show("Please enter all 8 digits", ToastAndroid.SHORT);
      }
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email: email as string,
      token: otpString,
      type: "signup",
    });

    if (error) {
      if (Platform.OS === "android") {
        ToastAndroid.show(error.message, ToastAndroid.SHORT);
      }
      setLoading(false);
    } else {
      if (Platform.OS === "android") {
        ToastAndroid.show("Verification successful!", ToastAndroid.SHORT);
      }
      setMood("Account");
      router.replace("/");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Confirm OTP</Text>
            <Text style={styles.subtitle}>
              Enter the 8-digit code sent to {email}
            </Text>
          </View>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                style={styles.otpInput}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                placeholderTextColor="#333"
              />
            ))}
          </View>

          <TouchableOpacity
            style={styles.verifyButton}
            onPress={handleVerify}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.verifyButtonText}>Verify</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.resendButton}>
            <Text style={styles.resendText}>
              Didn&apos;t receive code? Resend
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  backButton: {
    marginBottom: 40,
    marginTop: Platform.OS === "ios" ? 0 : 40,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 40,
    fontFamily: "BebasNeue",
    color: "#fff",
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    color: "#777",
    fontFamily: "RobotoSlab",
    marginTop: 5,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  otpInput: {
    width: 40,
    height: 55,
    backgroundColor: "#1C1C1E",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2C2C2E",
    color: "#fff",
    fontSize: 20,
    textAlign: "center",
    fontFamily: "BebasNeue",
  },
  verifyButton: {
    backgroundColor: "#E50914",
    borderRadius: 12,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#E50914",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  verifyButtonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "BebasNeue",
    letterSpacing: 1,
  },
  resendButton: {
    marginTop: 30,
    alignItems: "center",
  },
  resendText: {
    color: "#777",
    fontSize: 14,
    fontFamily: "RobotoSlab",
  },
});
