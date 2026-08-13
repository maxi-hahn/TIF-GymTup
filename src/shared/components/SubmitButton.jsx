const SubmitButton = ({ loading, loadingText, children, ...props }) => {
    return (
        <button type="submit" disabled={loading} {...props}>
            {loading ? loadingText : children}
        </button>
    )
}

export default SubmitButton