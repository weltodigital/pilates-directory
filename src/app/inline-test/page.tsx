export default function InlineTest() {
  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      margin: 0,
      padding: 0,
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <header style={{
        backgroundColor: 'white',
        padding: '16px',
        borderBottom: '1px solid #ddd',
        marginBottom: '24px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 16px'
        }}>
          <h1 style={{
            margin: 0,
            fontSize: '24px',
            color: '#333'
          }}>Inline Styles Test</h1>
        </div>
      </header>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 16px'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '48px'
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            marginBottom: '16px',
            color: '#333'
          }}>Inline Styles Test Page</h1>
          <p style={{
            fontSize: '20px',
            marginBottom: '24px',
            color: '#666'
          }}>If you can see this styled properly, inline styles work but CSS files don't!</p>
        </div>

        <div style={{
          backgroundColor: '#9333ea',
          color: 'white',
          padding: '24px',
          borderRadius: '8px',
          marginBottom: '32px',
          textAlign: 'center'
        }}>
          <h2 style={{ margin: '0 0 16px 0', fontSize: '32px' }}>Purple Test Block</h2>
          <p style={{ margin: 0, fontSize: '18px' }}>This should have a purple background with white text using inline styles.</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '48px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            border: '1px solid #e0e0e0'
          }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#333' }}>Card 1</h3>
            <p style={{ margin: '0 0 16px 0', color: '#666' }}>This should be a white card with shadow.</p>
            <button style={{
              backgroundColor: '#9333ea',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px'
            }}>Test Button</button>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            border: '1px solid #e0e0e0'
          }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#333' }}>Card 2</h3>
            <p style={{ margin: '0 0 16px 0', color: '#666' }}>Another white card with shadow and border.</p>
            <button style={{
              backgroundColor: '#9333ea',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px'
            }}>Another Button</button>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            border: '1px solid #e0e0e0'
          }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#333' }}>Card 3</h3>
            <p style={{ margin: '0 0 16px 0', color: '#666' }}>Third card to test grid layout.</p>
            <button style={{
              backgroundColor: '#9333ea',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px'
            }}>Third Button</button>
          </div>
        </div>
      </div>

      <footer style={{
        backgroundColor: '#1a1a1a',
        color: 'white',
        padding: '48px 0',
        marginTop: '48px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 16px',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0 }}>This is the footer - should be dark with white text using inline styles.</p>
        </div>
      </footer>
    </div>
  )
}