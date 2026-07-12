export default function Test({ result }: { result: string }) {
  return <pre>{result}</pre>;
}
export async function getServerSideProps() {
  try {
    const { searchCollection } = await import('../lib/aliexpress');
    const products = await searchCollection('eu', ['halloween costume'], 2);
    return { props: { result: JSON.stringify(products.length + ' products found', null, 2) } };
  } catch (e: any) {
    return { props: { result: 'ERROR: ' + (e?.message || String(e)) } };
  }
}
