const downloadFile = async (fileUrl: string, fileName: string) => {
    try {
        const response = await fetch(fileUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error downloading file:', error);
    }
}

export { downloadFile }