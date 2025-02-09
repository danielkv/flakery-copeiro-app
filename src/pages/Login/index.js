import React from 'react';
import { Alert, KeyboardAvoidingView } from 'react-native';
import { useApolloClient } from '@apollo/react-hooks';
import { Button, Input } from 'react-native-elements';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import logoResource from '../../assets/images/logo-copeiro.png';
import { Container, FormContainer, LogoImage, InputsContainer, ButtonsContainer, ContainerScroll } from './styles';
import { LOGIN } from '../../graphql/authentication';
import { logUserIn } from '../../services/init';
import { getErrors } from '../../utils/errors';

const validationSchema = Yup.object().shape({
	email: Yup.string()
		.email('Email inválido')
		.required('Obrigatório'),
	password: Yup.string()
		.required('Obrigatório'),
});

export default function login({ route, navigation }) {
	const redirect = route.params && route.params.redirect ? route.params.redirect : 'HomeScreen';

	const initialValues = {
		email: '',
		password: '',
	}

	const client = useApolloClient();

	const refs = {}
	const handleNextInput = (fieldName) => () => {
		refs[fieldName].focus();
	}

	const onSubmit = async ({ email, password }, { resetForm }) => {
		await client.mutate({ mutation: LOGIN, variables: { email, password } })
			.then(({ data })=>{
				resetForm();
				if (data.login.token) {
					logUserIn(data.login.user, data.login.token);
					navigation.navigate(redirect);
				}
			})
			.catch(err => {
				Alert.alert(getErrors(err));
			})
	}

	// eslint-disable-next-line no-shadow
	const { values: { email, password }, errors, handleSubmit, handleChange, handleBlur, isSubmitting } = useFormik({
		initialValues,
		validationSchema,
		onSubmit,
	});

	return (
		<KeyboardAvoidingView style={{ flex: 1 }} behavior='height'>
			<ContainerScroll>
				<Container>
					<LogoImage source={logoResource} />
					
					<FormContainer>
						<InputsContainer>
							<Input
								errorMessage={errors.email || ''}
								autoFocus
								placeholder='Email'
								keyboardType='email-address'
								autoCapitalize='none'
								autoCompleteType='email'
								onChangeText={handleChange('email')}
								onBlur={handleBlur('email')}
								disabled={isSubmitting}
								value={email}

								blurOnSubmit={false}
								returnKeyType='next'
								onSubmitEditing={handleNextInput('password')}
							/>
							<Input
								errorMessage={errors.password || ''}
								secureTextEntry
								autoCompleteType='password'
								placeholder='Senha'
								onChangeText={handleChange('password')}
								onBlur={handleBlur('password')}
								disabled={isSubmitting}
								value={password}
								
								ref={ref => { refs.password = ref }}
								onSubmitEditing={handleSubmit}
							/>
						</InputsContainer>
						<ButtonsContainer>
							<Button
								onPress={handleSubmit}
								disabled={isSubmitting}
								loading={isSubmitting}
								title='Login'
							/>
							<Button
								buttonStyle={{ backgroundColor: '#B95A02' }}
								titleStyle={{ color: '#fff' }}
								onPress={() => navigation.navigate('SubscriptionScreen')}
								disabled={isSubmitting}
								title='Quero me cadastrar'
							/>
							<Button
								buttonStyle={{ backgroundColor: 'transparent' }}
								titleStyle={{ color: '#fff' }}
								disabled={isSubmitting}
								title='Esqueci minha senha'
							/>
						</ButtonsContainer>
					</FormContainer>
				</Container>
			</ContainerScroll>
		</KeyboardAvoidingView>
	);
}
