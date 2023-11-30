"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  async function getContacts() {
    try {
      setIsLoading(true);
      const data = await fetch(process.env.NEXT_PUBLIC_URL);
      const result = await data.json();
      setContacts(result);
    } catch (e) {
      alert("failed to get contacts!");
    } finally {
      setIsLoading(false);
    }
  }

  async function removeContact(id) {
    try {
      setIsLoading(true);
      await fetch(`${process.env.NEXT_PUBLIC_URL}?id=eq.${id}`, {
        method: "DELETE",
      });
      await getContacts();
    } catch (e) {
      alert("failed to remove contact!");
    } finally {
      setIsLoading(false);
    }
  }

  async function addContact(e) {
    e.preventDefault();
    if (!name || !phone) {
      alert("No empty fields allowed!");
      return;
    }
    const data = { name, phone };
    try {
      setIsLoading(true);
      await fetch(process.env.NEXT_PUBLIC_URL, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      });
      setName("");
      setPhone("");
      await getContacts();
    } catch (e) {
      alert("failed to add contact!");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getContacts();
  }, []);

  const contactList = contacts?.map(({ id, name, phone }) => {
    return (
      <div
        key={id}
        className="flex justify-between w-full border py-2 px-4 rounded-md"
      >
        <div>
          <p className="font-semibold text-gray-800">{name}</p>
          <p className="text-sm">{phone}</p>
        </div>
        <button
          onClick={() => removeContact(id)}
          className="text-red-600 font-bold hover:underline"
        >
          delete
        </button>
      </div>
    );
  });

  return (
    <main className="mx-auto w-[80%] sm:w-[50%] md:w-[45%] flex flex-col items-center mt-12 border p-4 md:p-10 shadow-md rounded-sm">
      {/* { contacts } */}
      <p className="text-green-700 font-bold text-2xl">Neon Railway Contacts</p>
      <div className="w-full">
        <form className="flex flex-col gap-3">
          <span className="flex flex-col gap-2">
            <label>Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              className="border rounded-md p-2"
            />
          </span>
          <span className="flex flex-col gap-2">
            <label>Number</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="text"
              className="border rounded-md p-2"
            />
          </span>

          <button
            onClick={addContact}
            className="border bg-green-700 text-white py-2 mt-4 rounded-md"
          >
            Add contact
          </button>
        </form>
      </div>

      <div className="mt-11 w-full flex flex-col gap-3">
        {isLoading ? (
          <p className="text-xl font-bold text-gray-700 text-center">
            loading contacts...
          </p>
        ) : !contacts.length ? (
          <h3 className="text-xl font-bold text-gray-700 text-center">
            No Contacts!
          </h3>
        ) : (
          contactList
        )}
      </div>
    </main>
  );
}
