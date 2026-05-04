import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet
} from "react-native";

interface NavigateButtonProps {
    startNavigation: () => void;
}

const NavigateButton = ({startNavigation}: NavigateButtonProps) => {

    const styles = StyleSheet.create({
        container: {
            width: "80%"

        },
        navigationButton: {
            width: 256,
            position: "absolute",
            bottom: 96,
            left: 32,
            backgroundColor: "#1C3557",
            paddingVertical: 24,
            paddingHorizontal: 16,
            borderRadius: 24,
            borderWidth: 4,
            borderColor: "#FFFFFF"
        },
        text: {
            color: "#F5A623",
            textAlign: "center",
            fontSize: 32
        }
    })

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.navigationButton}
                onPress={startNavigation}
            >
                <Text style={styles.text}>---{'>'}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default NavigateButton;