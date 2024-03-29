import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { authenticate_endpoint, blogs_endpoint } from "./Universals";
import useFetchGET from "./useFetchGET";

const Create = () => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    //const [author, setAuthor] = useState(null);
    const [isPending, setIsPending] = useState(false);
    const history = useHistory();
    const { data: profile_data, isPending: profileFetchingisPending, error } = useFetchGET(authenticate_endpoint, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        //const blog = { title, body, author };
        const blog = { title, body };
        setIsPending(true);

        fetch(blogs_endpoint, {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(blog),
            credentials: 'include'
        }).then((res) => {
            if(!res.ok){
                throw Error('Could not fetch the data for that resource')
            }
            return res.json();
        }).then((data) => {
            console.log(data);
            setIsPending(false);
            history.push('/');
        })
    }


    return(
        <div className="create">
            <h2>Add a New Blog</h2>
            <form onSubmit={handleSubmit}>
                <label>Blog Title:</label>
                <input
                 type="text"
                 required
                 value={title}
                 onChange={(e) => setTitle(e.target.value)}
                 />
                 <label>Blog Body:</label>
                <textarea
                    required
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                 />
                 {!isPending && <button>Add Block</button>}
                 {isPending && <button disabled>Adding blog ...</button>}
            </form>
        </div>
    );
}

export default Create;