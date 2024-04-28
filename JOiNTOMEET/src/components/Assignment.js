import { apiUrl } from '../UrlConstants';
import { Alert, StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import AssignmentPreview from './AssignmentPreview';

const Assignment = ({ navigation, route }) => {
    const { email, name, clg, role } = route.params.Data;
    const {Data} = route.params;
    console.log( Data.role + " << assignment")
    const [assignments, setAssignments] = useState([]);
    const URL = `${apiUrl}/assignment?clg=${clg}`;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(URL);
                const data = await response.json();
                setAssignments(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: "#1c1c1c", justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{
                fontSize: 25,
                paddingVertical: 10,
                fontWeight: 600,
                color: "#6495ED",
                width: '80%',
                borderBottomColor: "white",
                borderBottomWidth: 2,
                marginBottom: 20,
                textAlign: 'center'
            }}>
                ASSIGNMENT
            </Text>
            <View style={styles.container}>
                {role == "teacher" ?
                    <TouchableOpacity style={styles.buttonHead}
                        onPress={() => {
                            navigation.navigate("CreateAssignment", { screen: "CreateAssignment", Data: Data })
                        }}
                    >
                        <Text style={styles.button}>
                            Create Assignment
                        </Text>
                    </TouchableOpacity> : null
                }
                <ScrollView style={{ flex: 1, width: '90%' }} showsVerticalScrollIndicator={false}>
                    {assignments.map((assignment, index) => (
                        <AssignmentPreview key={index} assignment={assignment} clg={clg} />
                    ))}
                </ScrollView>
            </View>
        </View>
    );
}

export default Assignment

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '90%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff', // Card background color
        paddingBottom: 20,
        paddingTop: 20,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,

    },
    buttonHead: {
        width: '100%',

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },

    button: {
        fontSize: 20,
        textAlign: 'center',
        fontFamily: 'MerriweatherSans-Regular',

        backgroundColor: '#6495ED',
        width: '80%',
        color: "black",

        borderWidth: 2,
        borderRadius: 5,
        marginBottom:10,
    },
})
