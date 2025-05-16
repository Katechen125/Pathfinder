import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { registerUser, loginUser, setCurrentUser } from '../Services/storage';
import { RootStackParamList } from '../Services/types';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';

type LoginScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'Login'>;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordRequirements, setPasswordRequirements] = useState({
        hasLength: false,
        hasUpper: false,
        hasLower: false,
        hasNumber: false,
        hasSpecial: false,
        noSequences: true,
    });

    useEffect(() => {
        validatePassword(password);
    }, [password]);

    const validatePassword = (input: string) => {
        setPasswordRequirements({
            hasLength: input.length >= 8 && input.length <= 30,
            hasLower: /[a-z]/.test(input),
            hasUpper: /[A-Z]/.test(input),
            hasNumber: /\d/.test(input),
            hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(input),
            noSequences: !/(abc|123|qwerty|password|admin|4444|000)/.test(input.toLowerCase()),
        });
    };

    const isPasswordValid = () => {
        return Object.values(passwordRequirements).every(Boolean);
    };

    const handleAuth = async () => {
        try {
            if (isLogin) {
                const success = await loginUser(username, password);
                if (success) {
                    await setCurrentUser(username);
                    navigation.navigate('Welcome');
                } else {
                    Alert.alert('Error', 'Invalid credentials');
                }
            } else {
                if (!isPasswordValid()) {
                    Alert.alert(
                        'Invalid Password',
                        'Please meet all password requirements'
                    );
                    return; 
                }

                await registerUser(username, password);
                await setCurrentUser(username);
                navigation.navigate('Welcome');
            }
        } catch (error) {
            const err = error as Error;
            Alert.alert('Error', err.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                <Icon name="user" size={28} color="#2196F3" /> {isLogin ? 'Login' : 'Register'}
            </Text>

            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <View style={styles.passwordContainer}>
                <TextInput
                    style={[styles.input, { flex: 1, marginBottom: 0 }]}
                    placeholder="Password"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                />
                <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(prev => !prev)}
                    accessibilityLabel={showPassword ? "Hide password" : "Show password"}
                >
                    <Icon name={showPassword ? "eye" : "eye-slash"} size={20} color="#888" />
                </TouchableOpacity>
            </View>

            {!isLogin && (
                <View style={styles.requirementsContainer}>
                    <Text style={styles.requirementsTitle}>Password must:</Text>

                    <View style={styles.requirementRow}>
                        <Icon
                            name={passwordRequirements.hasLength ? "check-circle" : "circle-o"}
                            size={16}
                            color={passwordRequirements.hasLength ? "#4CAF50" : "#888"}
                        />
                        <Text style={styles.requirementText}>Contain 8 to 30 characters</Text>
                    </View>

                    <View style={styles.requirementRow}>
                        <Icon
                            name={(passwordRequirements.hasUpper && passwordRequirements.hasLower) ? "check-circle" : "circle-o"}
                            size={16}
                            color={(passwordRequirements.hasUpper && passwordRequirements.hasLower) ? "#4CAF50" : "#888"}
                        />
                        <Text style={styles.requirementText}>Contain both lower and uppercase letters</Text>
                    </View>

                    <View style={styles.requirementRow}>
                        <Icon
                            name={passwordRequirements.hasNumber ? "check-circle" : "circle-o"}
                            size={16}
                            color={passwordRequirements.hasNumber ? "#4CAF50" : "#888"}
                        />
                        <Text style={styles.requirementText}>Contain 1 number</Text>
                    </View>

                    <View style={styles.requirementRow}>
                        <Icon
                            name={passwordRequirements.hasSpecial ? "check-circle" : "circle-o"}
                            size={16}
                            color={passwordRequirements.hasSpecial ? "#4CAF50" : "#888"}
                        />
                        <Text style={styles.requirementText}>Contain 1 special character (!@#$%...)</Text>
                    </View>

                    <View style={styles.requirementRow}>
                        <Icon
                            name={passwordRequirements.noSequences ? "check-circle" : "circle-o"}
                            size={16}
                            color={passwordRequirements.noSequences ? "#4CAF50" : "#888"}
                        />
                        <Text style={styles.requirementText}>No common sequences (123, abc, qwerty)</Text>
                    </View>
                </View>
            )}

            <TouchableOpacity style={styles.authButton} onPress={handleAuth}>
                <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Register'}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                <Text style={styles.switchText}>
                    {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f4f8fb',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2196F3',
        textAlign: 'center',
        marginBottom: 30,
    },
    input: {
        height: 50,
        borderColor: '#e3eaf4',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
        backgroundColor: 'white',
    },
    authButton: {
        backgroundColor: '#2196F3',
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
    switchText: {
        color: '#2196F3',
        textAlign: 'center',
        marginTop: 15,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
        marginBottom: 15,
    },
    eyeIcon: {
        position: 'absolute',
        right: 16,
        padding: 8,
        zIndex: 1,
    },
    requirementsContainer: {
        backgroundColor: '#f0f7ff',
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
    },
    requirementsTitle: {
        fontWeight: 'bold',
        marginBottom: 6,
        color: '#333',
    },
    requirementRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
    },
    requirementText: {
        marginLeft: 8,
        color: '#444',
        fontSize: 14,
    }
});

export default LoginScreen;
