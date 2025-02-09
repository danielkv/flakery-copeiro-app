import React, { useEffect, useCallback } from 'react';
import { TouchableOpacity } from 'react-native';
import { useQuery } from '@apollo/react-hooks';
import { Avatar, Button, Icon } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/core';

import { checkCondition } from '../../utils';
import {
	ContainerScroll,
	Container,
	UserHeader,
	UserName,
	UserEmail,
	ContentContainer,
} from './styles';
import LoadingBlock from '../../components/LoadingBlock';

import { IS_USER_LOGGED_IN, LOGGED_USER_ID } from '../../graphql/authentication';
import { GET_USER } from '../../graphql/users';

export default function Profile({ navigation }) {
	const { data: { isUserLoggedIn } } = useQuery(IS_USER_LOGGED_IN);
	const { data: { loggedUserId }, loading: loadingUserId } = useQuery(LOGGED_USER_ID);
	const { data: loggedUserData, loading: loadingUser } = useQuery(GET_USER, { variables: { id: loggedUserId } });

	const loggedUser = loggedUserData ? loggedUserData.user : null;
	const userInitials = loggedUser ? loggedUser.first_name.substr(0, 1).toUpperCase() + loggedUser.last_name.substr(0, 1).toUpperCase() : '';
	const user_id = loggedUser ? loggedUser.id : null

	useEffect(()=>{
		if (user_id) {
			navigation.setParams({
				headerRight: (
					<TouchableOpacity onPress={()=>navigation.navigate('SubscriptionScreen', { user_id })}>
						<Icon type='material-community' name='pencil' color='#fff' />
					</TouchableOpacity>
				)
			});
		}
	}, [navigation, user_id]);

	// navigate to HomeScreen if user is not logged in
	useFocusEffect(
		useCallback(() => {
			checkCondition(isUserLoggedIn, navigation, 'Você não está logado')
		}, [isUserLoggedIn])
	);

	if (loadingUser || loadingUserId) return <LoadingBlock />

	return (
		<ContainerScroll>
			<Container>
				<UserHeader>
					<Avatar size={90} rounded title={userInitials} />
					<UserName h1>{loggedUser.full_name}</UserName>
					<UserEmail h3>{loggedUser.email}</UserEmail>
				</UserHeader>
				<ContentContainer>
					<Button title='Meus Endereços' onPress={()=>navigation.navigate('AddressListScreen')} />
					<Button title='Meus Pedidos' onPress={()=>navigation.navigate('OrderListScreen')} />
				</ContentContainer>
			</Container>
		</ContainerScroll>
	);
}
