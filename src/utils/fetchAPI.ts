export async function fetchGET(url: string, token: string | undefined): Promise<any> {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: new Headers({
                Authorization: 'Bearer ' + token,
            }),
        });
        if (!response.ok) {
            throw new Error(
                `Unable to Fetch Data, Please check 
				URL or Network connectivity!!`
            );
        }
        const data = await response.json();
        return data;
    } catch (error: any) {
        console.error('An Error Occured: ', error.message);
    }
}
