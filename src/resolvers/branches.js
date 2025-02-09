import gql from 'graphql-tag';
import { AsyncStorage } from 'react-native';

export default {
	Query: {
		
	},
	Mutation: {
		// eslint-disable-next-line consistent-return
		selectBranch: async (_, { id }, { client, cache }) => {
			try {
				const { data } = await client.query({
					query: gql`
						query ($id:ID!) {
							branch (id:$id) {
								id
								name
								active
								last_month_revenue
								createdAt
							}
						}
					`,
					variables: { id },
				});
				
				cache.writeData({ data: { selectedBranch: data.branch.id } });

				AsyncStorage.setItem('@copeiro/selectedBranch', data.branch.id);

				return data.branch;
			} catch (e) {
				console.error(e);
			}
		},
		
	}
}