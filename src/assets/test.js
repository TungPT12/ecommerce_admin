import { Form, useNavigation } from "react-router-dom";

function Test() {
    const navigation = useNavigation()
    const text =
        navigation.state === "submitting"
            ? "Saving..."
            : navigation.state === "loading"
                ? "Saved!"
                : navigation.state;

    return (
        <Form method="POST">
            <button type="submit">{text}</button>
        </Form>
    );
}

export default Test;

export const action = () => {
    return null
}