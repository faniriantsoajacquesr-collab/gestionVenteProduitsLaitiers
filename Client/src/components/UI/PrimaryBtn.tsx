export default function PrimaryBtn({ displayText }: { displayText: string }) {
    return (
        <button className="w-full creamy-gradient text-on-primary font-bold py-5 rounded-full hover:scale-[1.02] hover:shadow-lg transition-all active:scale-95" type="submit">
            {displayText}
        </button>
    );
}