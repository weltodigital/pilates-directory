import '../minimal.css'

export default function CSSTest() {
  return (
    <div>
      <div className="test-header">
        <div className="test-container">
          <h1>CSS Test Page</h1>
        </div>
      </div>

      <div className="test-container">
        <div className="test-text-center">
          <h1 className="test-text-large">CSS Loading Test</h1>
          <p className="test-text-medium">If you can see styling, CSS is working!</p>
        </div>

        <div className="test-purple">
          <h2>Purple Test Block</h2>
          <p>This should have a purple background with white text.</p>
        </div>

        <div className="test-grid">
          <div className="test-card">
            <h3>Card 1</h3>
            <p>This should be a white card with shadow.</p>
            <a href="#" className="test-button">Test Button</a>
          </div>

          <div className="test-card">
            <h3>Card 2</h3>
            <p>Another white card with shadow and border.</p>
            <a href="#" className="test-button">Another Button</a>
          </div>

          <div className="test-card">
            <h3>Card 3</h3>
            <p>Third card to test grid layout.</p>
            <a href="#" className="test-button">Third Button</a>
          </div>
        </div>
      </div>

      <div className="test-footer">
        <div className="test-container test-text-center">
          <p>This is the footer - should be dark with white text.</p>
        </div>
      </div>
    </div>
  )
}