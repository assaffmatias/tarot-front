import { View, Text, SafeAreaView, TextInput, Button, Alert, ScrollView, Pressable } from "react-native";
import { Image, Checkbox, Tag } from "react-native-magnus";
import { useState, useEffect } from "react";
import { api } from "../axios";
import { useNavigation, useRoute } from "@react-navigation/native";
// import { navigate } from "../helpers";
import { stackRoutesNames } from "../routers/stackRoutesNames";

const Publications = () => {
    const [data, setData] = useState({});
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]); // array to store selected tag ids
    const route = useRoute();
    const { userid } = route.params
    const navigate = useNavigation()


    const allTags = [
        { "_id": "67328afc3fc8ed676eb876ac", "name": "Amor y Relaciones" },
        { "_id": "67328afc3fc8ed676eb876ad", "name": "Salud y Bienestar" },
        { "_id": "67328afc3fc8ed676eb876ae", "name": "Trabajo y Carrera" },
        { "_id": "67328afc3fc8ed676eb876af", "name": "Espiritualidad" },
        { "_id": "67328afc3fc8ed676eb876b0", "name": "Futuro Incierto" },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.GET('/services/list_user');
                if (response.length > 0) {
                    console.log('RESPONSE:', response[0].price);

                    setData(response[0]);
                    setName(response[0].name);
                    setDescription(response[0].description);
                    setPrice(response[0].price);
                    setTags(response[0].tags); // assuming tags are already an array of ids
                    setSelectedTags(response[0].tags); // set selected tags to the existing ones
                } else {
                    console.log('No hay publicaciones para este usuario.');
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    const handleTagSelection = (id) => {
        setSelectedTags((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((tagId) => tagId !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    const validateInputs = () => {
        return name !== "" && description !== "" && price !== 0 && selectedTags.length > 0;
    };

    const handleSubmit = async () => {
        if (!validateInputs()) {
            Alert.alert('Error', 'Por favor completa todos los campos.');
            return;
        }

        try {
            const updatedData = {
                ...data,
                user: userid,
                name,
                description,
                price,
                tags: selectedTags, // send only selected tags' ids
                // paymentMethod
            };

            if (data._id) {
                // Send PUT request to update the data
                await api.PUT(`/services/update/${data._id}`, updatedData);
                Alert.alert('Publicación actualizada!', 'Tu publicación ha sido enviada correctamente.');
            } else {
                // Send POST request to create new publication
                await api.POST('/services/create', updatedData);
                Alert.alert('Publicación creada!', 'Tu publicación ha sido enviada correctamente.');
                navigate.goBack()
            }

        } catch (error) {
            console.error("Error updating data:", error);
            Alert.alert('Error', 'Ocurrió un error al intentar actualizar tu publicación.');
        }
    };

    const onPriceChange = (value) => {
        const numericValue = parseFloat(value);
        if (!isNaN(numericValue)) {
            setPrice(numericValue);
        } else {
            // If it's not a number, reset to 0
            setPrice(0);
        }
    };

    return (
        <SafeAreaView>
            <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
                <View style={{ marginTop: 20, width: '100%', alignItems: 'center' }}>
                    <Image
                        rounded={25}
                        source={{ uri: 'https://png.pngtree.com/thumb_back/fh260/background/20230610/pngtree-wizard-holds-the-fire-as-he-walks-through-the-forest-image_2924861.jpg' }}
                        w={"95%"}
                        alignSelf="center"
                        h={300}
                        mb={20}
                    />
                    <Text style={{ fontSize: 16, marginVertical: 5, textAlign: 'left', width: '95%', marginLeft: 10, color: '#191970', fontWeight: '900'}}>Nombre</Text>
                    <TextInput
                        style={{ borderWidth: 1, padding: 10, width: '95%', borderRadius: 10, marginBottom: 20, borderColor: '#191970' }}
                        placeholder="Nombre"
                        value={name}
                        onChangeText={setName}
                    />
                    <Text style={{ fontSize: 16, marginVertical: 5, textAlign: 'left', width: '95%', marginLeft: 10, color: '#191970', fontWeight: '900' }}>Descripción del servicio</Text>
                    <TextInput
                        style={{ borderWidth: 1, padding: 10, width: '95%', borderRadius: 10, marginBottom: 20, borderColor: '#191970' }}
                        placeholder="Descripción"
                        value={description}
                        onChangeText={setDescription}
                    />
                    <Text style={{ fontSize: 16, marginVertical: 5, textAlign: 'left', width: '95%', marginLeft: 10, color: '#191970', fontWeight: '900' }}>Precio por minuto $USD</Text>
                    <TextInput
                        style={{ borderWidth: 1, padding: 10, width: '95%', borderRadius: 10, marginBottom: 20, borderColor: '#191970' }}
                        placeholder="Precio"
                        value={String(price)}
                        onChangeText={onPriceChange}
                        keyboardType="numeric"
                    />
                    <View style={{ marginBottom: 20, width: '95%' }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', marginVertical: 20, textAlign: 'center', color: '#191970' }}>Seleccionar Tags</Text>
                        <View style={{ marginBottom: 20, justifyContent: 'center' }}>
                            {allTags.map((tag) => (
                                <View key={tag._id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5, marginHorizontal: 10 }}>
                                    <Checkbox
                                        checked={selectedTags.includes(tag._id)}
                                        onChange={() => handleTagSelection(tag._id)}
                                        borderColor="#f6e05e" // Color del borde del checkbox
                                        activeColor="#f6e05e" // Color cuando está activo (marcado)
                                        inactiveColor="#f6e05e" // Color cuando está inactivo (no marcado)
                                    />
                                    <Tag ml={"sm"} bg="yellow400" color="gray-dark" fontFamily="Medium">{tag.name}</Tag>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
                <Pressable onPress={handleSubmit} style={{ backgroundColor: '#191970', width: '90%', paddingVertical: 15, borderRadius: 10 }}>
                    <Text style={{ textAlign: 'center', fontSize: 16, color: 'white' }}>Enviar</Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Publications;
