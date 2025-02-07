export async function fetchData(url: string) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network Response was no ok');
        }
        const data = await response.json();
        console.log('Success:', data);
        return data;
    } catch (error) {
        console.log('Error:', error);
    }
}
